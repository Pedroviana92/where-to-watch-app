import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getMovieDetails,
  getTVShowDetails,
  getMovieExternalIds,
  getTVShowExternalIds,
} from '@/lib/services/tmdb';
import { getRatings } from '@/lib/services/omdb';
import { getStreamingAvailability, getStreamingFromTMDb } from '@/lib/services/streaming';

/**
 * GET /api/movie/:id?type=movie
 * Obtém detalhes completos de um filme/série incluindo ratings e streaming
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tmdbId = parseInt(params.id);
    const searchParams = request.nextUrl.searchParams;
    const mediaType = (searchParams.get('type') as 'movie' | 'tv') || 'movie';

    if (isNaN(tmdbId)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    // 1. Verificar se já existe no banco de dados
    let dbMovie = await prisma.movie.findUnique({
      where: { tmdbId },
      include: {
        ratings: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
        streamingAvailability: {
          where: { available: true },
          orderBy: { recordedAt: 'desc' },
        },
      },
    });

    // 2. Se não existe, buscar nas APIs e salvar
    if (!dbMovie) {
      console.log("buscou na api!")
      // Buscar detalhes do TMDb
      const tmdbDetails = mediaType === 'movie'
        ? await getMovieDetails(tmdbId)
        : await getTVShowDetails(tmdbId);

      // Buscar IMDB ID
      const externalIds = mediaType === 'movie'
        ? await getMovieExternalIds(tmdbId)
        : await getTVShowExternalIds(tmdbId);

      const imdbId = externalIds.imdb_id;

      // Buscar ratings do OMDb (se tiver IMDB ID)
      let ratings: { imdb?: number; rottenTomatoes?: number; metacritic?: number } = {};
      if (imdbId) {
        ratings = await getRatings(imdbId);
      }

      // Buscar streaming availability usando TMDb (gratuito e confiável)
      // A Streaming Availability API do RapidAPI está com problemas no endpoint
      let streamingServices: Array<{ service: string; streamingType: string; link: string }> = [];

      // Usar TMDb Watch Providers (funciona bem para o Brasil)
      streamingServices = await getStreamingFromTMDb(tmdbId, mediaType);

      // Salvar no banco de dados (com proteção contra race condition)
      try {
        dbMovie = await prisma.movie.create({
          data: {
            tmdbId,
            imdbId,
            title: tmdbDetails.title || tmdbDetails.name || '',
            titlePt: tmdbDetails.title || tmdbDetails.name || '',
            overview: tmdbDetails.overview,
            posterPath: tmdbDetails.poster_path,
            backdropPath: tmdbDetails.backdrop_path,
            releaseDate: tmdbDetails.release_date || tmdbDetails.first_air_date
              ? new Date(tmdbDetails.release_date || tmdbDetails.first_air_date!)
              : null,
            mediaType,
            ratings: {
              create: {
                imdbRating: ratings.imdb || null,
                rottenTomatoes: ratings.rottenTomatoes || null,
                metacritic: ratings.metacritic || null,
              },
            },
            streamingAvailability: {
              create: streamingServices.map((service) => ({
                provider: service.service,
                streamingType: service.streamingType,
                link: service.link,
                available: true,
              })),
            },
          },
          include: {
            ratings: true,
            streamingAvailability: {
              where: { available: true },
            },
          },
        });
      } catch (error: any) {
        // Se o erro for "unique constraint" (P2002), significa que outro request
        // criou o filme entre nossa verificação e tentativa de criar.
        // Nesse caso, buscamos o filme que já existe.
        if (error.code === 'P2002') {
          dbMovie = await prisma.movie.findUnique({
            where: { tmdbId },
            include: {
              ratings: {
                orderBy: { recordedAt: 'desc' },
                take: 1,
              },
              streamingAvailability: {
                where: { available: true },
                orderBy: { recordedAt: 'desc' },
              },
            },
          });
        } else {
          // Se for outro erro, repassa
          throw error;
        }
      }
    }

    // 3. Formatar resposta
    const latestRating = dbMovie.ratings[0];

    return NextResponse.json({
      success: true,
      movie: {
        id: dbMovie.id,
        tmdbId: dbMovie.tmdbId,
        imdbId: dbMovie.imdbId,
        title: dbMovie.title,
        titlePt: dbMovie.titlePt,
        overview: dbMovie.overview,
        posterPath: dbMovie.posterPath,
        backdropPath: dbMovie.backdropPath,
        releaseDate: dbMovie.releaseDate,
        mediaType: dbMovie.mediaType,
        ratings: {
          imdb: latestRating?.imdbRating,
          rottenTomatoes: latestRating?.rottenTomatoes,
          metacritic: latestRating?.metacritic,
        },
        streamingOptions: dbMovie.streamingAvailability.map((s: any) => ({
          provider: s.provider,
          type: s.streamingType,
          link: s.link,
          recordedAt: s.recordedAt,
        })),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do filme' },
      { status: 500 }
    );
  }
}
