import { NextRequest, NextResponse } from 'next/server';
import { searchMulti } from '@/lib/services/tmdb';

/**
 * GET /api/search?q=filme
 * Busca filmes e séries pelo nome
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: 'Parâmetro "q" (query) é obrigatório' },
        { status: 400 }
      );
    }

    // Busca no TMDb
    const results = await searchMulti(query);

    // Formatar resultados para o frontend
    const formattedResults = results.map((item) => ({
      id: item.id,
      title: item.title || item.name,
      originalTitle: item.original_title || item.original_name,
      overview: item.overview,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      releaseDate: item.release_date || item.first_air_date,
      mediaType: item.media_type,
      rating: item.vote_average,
      voteCount: item.vote_count,
    }));

    return NextResponse.json({
      success: true,
      results: formattedResults,
      total: formattedResults.length,
    });
  } catch (error) {
    console.error('Erro na busca:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar filmes/séries' },
      { status: 500 }
    );
  }
}
