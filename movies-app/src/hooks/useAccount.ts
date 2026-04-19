import { useQuery } from '@tanstack/react-query';
import { accountApi } from '../api/account.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useAccount = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.account],
    queryFn: accountApi.getAccountDetails,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
