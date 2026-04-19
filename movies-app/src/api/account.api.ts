import { axiosClient } from './axios-client';
import type { Account, Movie, PaginatedResponse } from '../types/tmdb.types';

export const accountApi = {
  getAccountDetails: async (): Promise<Account> => {
    const { data } = await axiosClient.get<Account>('/account');
    return data;
  },

  getWatchlistMovies: async (accountId: number, page = 1): Promise<PaginatedResponse<Movie>> => {
    const { data } = await axiosClient.get<PaginatedResponse<Movie>>(
      `/account/${accountId}/watchlist/movies`,
      { params: { page } }
    );
    return data;
  },
};
