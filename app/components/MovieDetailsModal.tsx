'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import RatingsDisplay from './RatingsDisplay';
import StreamingAvailability from './StreamingAvailability';

interface MovieDetails {
  id: number;
  tmdbId: number;
  imdbId: string | null;
  title: string;
  titlePt: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: Date | null;
  mediaType: string;
  ratings: {
    imdb?: number | null;
    rottenTomatoes?: number | null;
    metacritic?: number | null;
  };
  streamingOptions: {
    provider: string;
    type: string;
    link: string | null;
    recordedAt?: Date;
  }[];
}

interface MovieDetailsModalProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  onClose: () => void;
}

export default function MovieDetailsModal({
  tmdbId,
  mediaType,
  onClose,
}: MovieDetailsModalProps) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/movie/${tmdbId}?type=${mediaType}`);

        if (!response.ok) {
          throw new Error('Erro ao buscar detalhes do filme');
        }

        const data = await response.json();
        setMovie(data.movie);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchMovieDetails();
  }, [tmdbId, mediaType]);

  const backdropUrl = movie?.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : null;

  const posterUrl = movie?.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="flex items-center justify-center p-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="p-12 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Fechar
            </button>
          </div>
        )}

        {movie && !loading && (
          <>
            {/* Backdrop */}
            {backdropUrl && (
              <div className="relative h-80 md:h-96 overflow-hidden">
                <Image
                  src={backdropUrl}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              </div>
            )}

            {/* Conteúdo */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                {/* Poster */}
                {posterUrl && (
                  <div className="flex-shrink-0">
                    <div className="relative w-48 h-72 rounded-lg overflow-hidden shadow-2xl">
                      <Image
                        src={posterUrl}
                        alt={movie.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {movie.title}
                  </h1>

                  {movie.releaseDate && (
                    <p className="text-gray-400 mb-4">
                      {new Date(movie.releaseDate).getFullYear()} •{' '}
                      {movie.mediaType === 'tv' ? 'Série' : 'Filme'}
                    </p>
                  )}

                  {movie.overview && (
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      {movie.overview}
                    </p>
                  )}

                  {/* Links externos */}
                  <div className="flex gap-3">
                    {movie.imdbId && (
                      <a
                        href={`https://www.imdb.com/title/${movie.imdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-white text-sm font-medium transition-colors"
                      >
                        Ver no IMDB
                      </a>
                    )}
                    <a
                      href={`https://www.themoviedb.org/${movie.mediaType}/${movie.tmdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition-colors"
                    >
                      Ver no TMDb
                    </a>
                  </div>
                </div>
              </div>

              {/* Avaliações */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Avaliações</h2>
                <RatingsDisplay ratings={movie.ratings} />
              </div>

              {/* Onde assistir */}
              <StreamingAvailability streamingOptions={movie.streamingOptions} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
