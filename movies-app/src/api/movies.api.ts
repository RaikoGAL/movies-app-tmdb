import { axiosClient } from './axios-client';
import type { Movie, PaginatedResponse } from '../types/tmdb.types';

export const moviesApi = {
  getTopRatedMovies: async (page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await axiosClient.get<PaginatedResponse<Movie>>('/movie/top_rated', {
      params: { page },
    });
    return data;
  },

  getMovieDetails: async (movieId: number): Promise<Movie> => {
    const { data } = await axiosClient.get<Movie>(`/movie/${movieId}`);
    return data;
  },

  getMovieAccountStates: async (movieId: number): Promise<{ watchlist: boolean; rated: boolean | { value: number } }> => {
    const { data } = await axiosClient.get<{ watchlist: boolean; rated: boolean | { value: number } }>(
      `/movie/${movieId}/account_states`
    );
    return data;
  },

  searchMovies: async (query: string, year?: number, page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await axiosClient.get<PaginatedResponse<Movie>>('/search/movie', {
      params: { query, primary_release_year: year, page },
    });
    return data;
  },

  addMovieRating: async (movieId: number, rating: number): Promise<{ status_code: number; status_message: string }> => {
    const { data } = await axiosClient.post(`/movie/${movieId}/rating`, { value: rating });
    return data;
  },

  addToWatchlist: async (
    accountId: number,
    movieId: number,
    watchlist: boolean
  ): Promise<{ status_code: number; status_message: string }> => {
    const { data } = await axiosClient.post(`/account/${accountId}/watchlist`, {
      media_type: 'movie',
      media_id: movieId,
      watchlist,
    });
    return data;
  },
};
