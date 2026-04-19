import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moviesApi } from '../api/movies.api';
import { QUERY_KEYS } from '../constants/queryKeys';

export const useTopRatedMovies = (page = 1) => {
  return useQuery({
    queryKey: [QUERY_KEYS.topRated, page],
    queryFn: () => moviesApi.getTopRatedMovies(page),
  });
};

export const useMovieDetails = (movieId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.details, movieId],
    queryFn: () => moviesApi.getMovieDetails(movieId),
    enabled: !!movieId,
  });
};

export const useMovieAccountStates = (movieId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.accountStates, movieId],
    queryFn: () => moviesApi.getMovieAccountStates(movieId),
    enabled: !!movieId,
  });
};

export const useSearchMovies = (query: string, year?: number, page = 1) => {
  return useQuery({
    queryKey: [QUERY_KEYS.search, query, year, page],
    queryFn: () => moviesApi.searchMovies(query, year, page),
    enabled: !!query.trim(), // Only run if search query is provided
  });
};

export const useAddRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ movieId, rating }: { movieId: number; rating: number }) =>
      moviesApi.addMovieRating(movieId, rating),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.accountStates, variables.movieId],
      });
    },
    onSettled: (_, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.accountStates, variables.movieId],
      });
    },
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      accountId,
      movieId,
      watchlist,
    }: {
      accountId: number;
      movieId: number;
      watchlist: boolean;
    }) => moviesApi.addToWatchlist(accountId, movieId, watchlist),
    onMutate: async ({ movieId, watchlist }) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.accountStates, movieId] });

      // Snapshot the previous value
      const previousState = queryClient.getQueryData([QUERY_KEYS.accountStates, movieId]);

      // Optimistically update to the new value
      queryClient.setQueryData([QUERY_KEYS.accountStates, movieId], (old: any) => ({
        ...old,
        watchlist,
      }));

      // Return a context object with the snapshotted value
      return { previousState };
    },
    onError: (_err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousState) {
        queryClient.setQueryData(
          [QUERY_KEYS.accountStates, variables.movieId],
          context.previousState
        );
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate the general watchlist to keep lists in sync
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.watchlist, variables.accountId],
      });
    },
    onSettled: (_data, _error, variables) => {
      // Always refetch after error or success to ensure we represent the server state
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.accountStates, variables.movieId]
      });
    },
  });
};
