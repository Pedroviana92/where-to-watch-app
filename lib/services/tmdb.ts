import axios from 'axios';
import { TMDbMovie, TMDbSearchResponse, TMDbExternalIds } from '../types';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN;

const tmdbClient = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

/**
 * Busca filmes e séries por nome
 */
export async function searchMulti(query: string, language = 'pt-BR'): Promise<TMDbMovie[]> {
  try {
    const response = await tmdbClient.get<TMDbSearchResponse>('/search/multi', {
      params: {
        query,
        language,
        include_adult: false,
        page: 1,
      },
    });

    // Filtrar apenas filmes e séries TV
    return response.data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (error) {
    console.error('Erro ao buscar no TMDb:', error);
    throw new Error('Falha ao buscar filmes/séries no TMDb');
  }
}

/**
 * Busca apenas filmes por nome
 */
export async function searchMovies(query: string, language = 'pt-BR'): Promise<TMDbMovie[]> {
  try {
    const response = await tmdbClient.get<TMDbSearchResponse>('/search/movie', {
      params: {
        query,
        language,
        include_adult: false,
        page: 1,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes no TMDb:', error);
    throw new Error('Falha ao buscar filmes no TMDb');
  }
}

/**
 * Busca apenas séries TV por nome
 */
export async function searchTVShows(query: string, language = 'pt-BR'): Promise<TMDbMovie[]> {
  try {
    const response = await tmdbClient.get<TMDbSearchResponse>('/search/tv', {
      params: {
        query,
        language,
        include_adult: false,
        page: 1,
      },
    });

    return response.data.results.map(show => ({
      ...show,
      media_type: 'tv' as const,
    }));
  } catch (error) {
    console.error('Erro ao buscar séries no TMDb:', error);
    throw new Error('Falha ao buscar séries no TMDb');
  }
}

/**
 * Obtém detalhes completos de um filme
 */
export async function getMovieDetails(movieId: number, language = 'pt-BR'): Promise<TMDbMovie> {
  try {
    const response = await tmdbClient.get<TMDbMovie>(`/movie/${movieId}`, {
      params: { language },
    });

    return {
      ...response.data,
      media_type: 'movie',
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do filme:', error);
    throw new Error('Falha ao buscar detalhes do filme');
  }
}

/**
 * Obtém detalhes completos de uma série TV
 */
export async function getTVShowDetails(tvId: number, language = 'pt-BR'): Promise<TMDbMovie> {
  try {
    const response = await tmdbClient.get<TMDbMovie>(`/tv/${tvId}`, {
      params: { language },
    });

    return {
      ...response.data,
      media_type: 'tv',
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes da série:', error);
    throw new Error('Falha ao buscar detalhes da série');
  }
}

/**
 * Obtém IDs externos (IMDB, Facebook, etc) de um filme
 */
export async function getMovieExternalIds(movieId: number): Promise<TMDbExternalIds> {
  try {
    const response = await tmdbClient.get<TMDbExternalIds>(`/movie/${movieId}/external_ids`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar IDs externos do filme:', error);
    throw new Error('Falha ao buscar IDs externos');
  }
}

/**
 * Obtém IDs externos de uma série TV
 */
export async function getTVShowExternalIds(tvId: number): Promise<TMDbExternalIds> {
  try {
    const response = await tmdbClient.get<TMDbExternalIds>(`/tv/${tvId}/external_ids`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar IDs externos da série:', error);
    throw new Error('Falha ao buscar IDs externos');
  }
}

/**
 * Obtém a URL completa de uma imagem do TMDb
 */
export function getImageUrl(path: string | null, size: 'w500' | 'original' = 'w500'): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Obtém filmes populares (para popular o banco de dados)
 */
export async function getPopularMovies(page = 1, language = 'pt-BR'): Promise<TMDbMovie[]> {
  try {
    const response = await tmdbClient.get<TMDbSearchResponse>('/movie/popular', {
      params: {
        language,
        page,
      },
    });

    return response.data.results.map(movie => ({
      ...movie,
      media_type: 'movie' as const,
    }));
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    throw new Error('Falha ao buscar filmes populares');
  }
}

/**
 * Obtém séries TV populares (para popular o banco de dados)
 */
export async function getPopularTVShows(page = 1, language = 'pt-BR'): Promise<TMDbMovie[]> {
  try {
    const response = await tmdbClient.get<TMDbSearchResponse>('/tv/popular', {
      params: {
        language,
        page,
      },
    });

    return response.data.results.map(show => ({
      ...show,
      media_type: 'tv' as const,
    }));
  } catch (error) {
    console.error('Erro ao buscar séries populares:', error);
    throw new Error('Falha ao buscar séries populares');
  }
}
