'use client';

import { useState } from 'react';
import SearchBar from './components/SearchBar';
import MovieCard from './components/MovieCard';
import MovieDetailsModal from './components/MovieDetailsModal';

interface SearchResult {
  id: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate?: string;
  mediaType: 'movie' | 'tv';
  rating: number;
  voteCount: number;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<{
    tmdbId: number;
    mediaType: 'movie' | 'tv';
  } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.results);
      } else {
        console.error('Erro na busca:', data.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Erro ao buscar:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovieClick = (movie: SearchResult) => {
    setSelectedMovie({
      tmdbId: movie.id,
      mediaType: movie.mediaType,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Header */}
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-4">
          Where to Watch
        </h1>
        <p className="text-center text-gray-300 mb-12 text-lg">
          Encontre onde assistir seus filmes e séries favoritos
        </p>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Results */}
      {!isLoading && searchResults.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-6">
            Resultados da Busca ({searchResults.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.map((movie) => (
              <MovieCard
                key={`${movie.id}-${movie.mediaType}`}
                id={movie.id}
                title={movie.title}
                overview={movie.overview}
                posterPath={movie.posterPath}
                releaseDate={movie.releaseDate}
                rating={movie.rating}
                mediaType={movie.mediaType}
                onClick={() => handleMovieClick(movie)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && hasSearched && searchResults.length === 0 && (
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-4">
              Nenhum resultado encontrado
            </p>
            <p className="text-gray-500">
              Tente buscar por outro filme ou série
            </p>
          </div>
        </div>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailsModal
          tmdbId={selectedMovie.tmdbId}
          mediaType={selectedMovie.mediaType}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-white/10">
        <p className="text-center text-gray-500 text-sm">
          Dados fornecidos por{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            TMDb
          </a>
          {' '}e{' '}
          <a
            href="http://www.omdbapi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            OMDb
          </a>
        </p>
      </footer>
    </main>
  );
}
