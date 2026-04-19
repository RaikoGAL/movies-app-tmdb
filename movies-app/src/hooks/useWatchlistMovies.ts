import { useQuery } from '@tanstack/react-query';
import { accountApi } from '../api/account.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useWatchlistMovies = (accountId: number | undefined, page = 1) => {
  return useQuery({
    queryKey: [QUERY_KEYS.watchlist, accountId, page],
    queryFn: () => accountApi.getWatchlistMovies(accountId!, page),
    enabled: !!accountId, // Only run if accountId is available
  });
};
