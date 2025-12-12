import axios from 'axios';
import { OMDbMovie, AggregatedRatings } from '../types';

// Nova API: Movie Database Alternative via RapidAPI
const MOVIE_DB_BASE_URL = 'https://movie-database-alternative.p.rapidapi.com/';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

/**
 * Busca informações de um filme/série pelo ID do IMDB
 * Usa a API Movie Database Alternative via RapidAPI
 */
export async function getMovieByImdbId(imdbId: string): Promise<OMDbMovie | null> {
  try {
    const response = await axios.get<OMDbMovie>(MOVIE_DB_BASE_URL, {
      params: {
        r: 'json',
        i: imdbId,
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'movie-database-alternative.p.rapidapi.com',
      },
    });

    if (response.data.Response === 'False') {
      console.warn(`Filme não encontrado na Movie Database API: ${imdbId}`);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar na Movie Database API:', error);
    return null;
  }
}

/**
 * Busca informações de um filme/série por título
 * Usa a API Movie Database Alternative via RapidAPI
 */
export async function searchByTitle(title: string, year?: string): Promise<OMDbMovie | null> {
  try {
    const response = await axios.get<OMDbMovie>(MOVIE_DB_BASE_URL, {
      params: {
        r: 'json',
        t: title,
        y: year,
      },
      headers: {
        'x-rapidapi-key': RAPIDAPI_KEY,
        'x-rapidapi-host': 'movie-database-alternative.p.rapidapi.com',
      },
    });

    if (response.data.Response === 'False') {
      console.warn(`Filme não encontrado na Movie Database API: ${title}`);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error('Erro ao buscar na Movie Database API:', error);
    return null;
  }
}

/**
 * Extrai as avaliações e converte para o formato agregado
 * Compatível com Movie Database Alternative API (mesmo formato do OMDb)
 */
export function extractRatings(omdbMovie: OMDbMovie): AggregatedRatings {
  const ratings: AggregatedRatings = {};

  // IMDB Rating
  if (omdbMovie.imdbRating && omdbMovie.imdbRating !== 'N/A') {
    ratings.imdb = parseFloat(omdbMovie.imdbRating);
  }

  // Metacritic
  if (omdbMovie.Metascore && omdbMovie.Metascore !== 'N/A') {
    ratings.metacritic = parseInt(omdbMovie.Metascore, 10);
  }

  // Rotten Tomatoes
  const rtRating = omdbMovie.Ratings?.find((r) => r.Source === 'Rotten Tomatoes');
  if (rtRating) {
    const match = rtRating.Value.match(/(\d+)%/);
    if (match) {
      ratings.rottenTomatoes = parseInt(match[1], 10);
    }
  }

  return ratings;
}

/**
 * Obtém ratings agregados para um filme usando IMDB ID
 */
export async function getRatings(imdbId: string): Promise<AggregatedRatings> {
  const omdbMovie = await getMovieByImdbId(imdbId);

  if (!omdbMovie) {
    return {};
  }

  return extractRatings(omdbMovie);
}

/**
 * Obtém ratings agregados para um filme usando título
 */
export async function getRatingsByTitle(title: string, year?: string): Promise<AggregatedRatings> {
  const omdbMovie = await searchByTitle(title, year);

  if (!omdbMovie) {
    return {};
  }

  return extractRatings(omdbMovie);
}
