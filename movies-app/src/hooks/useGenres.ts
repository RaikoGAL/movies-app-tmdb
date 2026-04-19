import { useQuery } from '@tanstack/react-query';
import { genresApi } from '../api/genres.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useGenres = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.genres],
    queryFn: genresApi.getMovieGenres,
    staleTime: Infinity, // Genres are static and rarely change
  });
};
