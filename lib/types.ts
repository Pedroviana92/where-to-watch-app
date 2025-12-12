// Tipos para TMDb API
export interface TMDbMovie {
  id: number;
  title?: string;
  name?: string; // Para séries TV
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string; // Para séries TV
  media_type?: 'movie' | 'tv';
  vote_average: number;
  vote_count: number;
}

export interface TMDbSearchResponse {
  page: number;
  results: TMDbMovie[];
  total_pages: number;
  total_results: number;
}

export interface TMDbExternalIds {
  imdb_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  twitter_id: string | null;
}

// Tipos para OMDb API
export interface OMDbRating {
  Source: string;
  Value: string;
}

export interface OMDbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OMDbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

// Tipos para Streaming Availability API
export interface StreamingProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface StreamingOption {
  type: 'subscription' | 'rent' | 'buy' | 'free';
  provider: StreamingProvider;
  link: string;
}

export interface StreamingAvailability {
  country: string;
  streamingOptions: StreamingOption[];
}

// Tipos agregados para o frontend
export interface AggregatedRatings {
  imdb?: number;
  rottenTomatoes?: number;
  metacritic?: number;
  tmdb?: number;
}

export interface MovieWithDetails {
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
  ratings: AggregatedRatings;
  streamingOptions: {
    provider: string;
    type: string;
    link: string | null;
    logo: string | null;
  }[];
}
