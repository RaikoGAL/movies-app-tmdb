import { axiosClient } from './axios-client';
import type { GenresResponse } from '../types/tmdb.types';

export const genresApi = {
  getMovieGenres: async (): Promise<GenresResponse> => {
    const { data } = await axiosClient.get<GenresResponse>('/genre/movie/list');
    return data;
  },
};
