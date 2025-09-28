import axios, { type AxiosResponse } from "axios";
import type { Movie } from "../types/movie";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN as string | undefined;

interface TmdbMovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;
  page: number;
}

interface FetchMoviesParams {
  query: string;
  page?: number;
}

export async function fetchMovies({
  query,
  page = 1,
}: FetchMoviesParams): Promise<Movie[]> {
  if (!TMDB_TOKEN) {
    throw new Error("TMDB API token is not set. Check your .env file.");
  }

  const config = {
    params: {
      query,                
      page,                 
      include_adult: false, 
      language: "en-US",
    },
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`, 
      Accept: "application/json",
    },
  };

  const response: AxiosResponse<TmdbMovieResponse> = await axios.get(
    BASE_URL,
    config
  );
  return response.data.results; 
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/";

export function getImageUrl(
  path: string | null,
  size: "w500" | "original" = "w500"
): string {
  if (!path) {
    return "https://via.placeholder.com/500x750?text=No+Image";
  }
  return `${IMAGE_BASE_URL}${size}${path}`;
}