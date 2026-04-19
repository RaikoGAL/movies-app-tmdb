import { useState, type FC } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { RatingDialog } from './RatingDialog';
import { useAddRating, useAddToWatchlist, useMovieAccountStates } from '../../hooks/useMovies';
import type { Movie } from '../../types/tmdb.types';

interface MovieActionsProps {
  movie: Movie;
  accountId?: number;
}

export const MovieActions: FC<MovieActionsProps> = ({ movie, accountId }) => {
  const [isRatingOpen, setIsRatingOpen] = useState(false);
  
  // Real-time state awareness
  const { data: accountStates, isLoading: isStateLoading } = useMovieAccountStates(movie.id);
  
  const addRating = useAddRating();
  const addToWatchlist = useAddToWatchlist();

  const handleRate = (rating: number) => {
    addRating.mutate({ movieId: movie.id, rating });
  };

  const handleWatchlist = () => {
    if (!accountId) return;
    const isRemove = accountStates?.watchlist;
    addToWatchlist.mutate({
      accountId,
      movieId: movie.id,
      watchlist: !isRemove,
    });
  };

  const isAdded = accountStates?.watchlist;
  const userRating = typeof accountStates?.rated === 'object' ? accountStates.rated.value : null;
  const isPending = addRating.isPending || addToWatchlist.isPending;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Rating Section */}
      <Box>
        <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, mb: 1, display: 'block', lineHeight: 1 }}>
          Your Rating
        </Typography>
        
        <Button
          variant="outlined"
          size="small"
          onClick={() => setIsRatingOpen(true)}
          disabled={isPending || isStateLoading}
          sx={{ 
            height: 40,
            borderColor: userRating ? 'primary.main' : 'rgba(255,255,255,0.1)',
            color: userRating ? 'primary.main' : 'text.primary',
            fontWeight: 800,
            textTransform: 'none',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(245, 197, 24, 0.05)' }
          }}
        >
          {userRating ? `★ ${userRating}/10` : 'Rate Movie'}
        </Button>
      </Box>
      
      {/* Watchlist Section */}
      <Button
        variant={isAdded ? "outlined" : "text"}
        size="small"
        onClick={handleWatchlist}
        disabled={isPending || !accountId || isStateLoading}
        startIcon={
          isPending ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            <Typography sx={{ fontSize: '1.2rem', mr: 0.5, fontWeight: 900 }}>
              {isAdded ? '✓' : '+'}
            </Typography>
          )
        }
        sx={{ 
          fontSize: '0.75rem', 
          fontWeight: 900, 
          letterSpacing: 1,
          justifyContent: 'flex-start',
          color: isAdded ? 'success.main' : 'text.secondary',
          borderColor: isAdded ? 'success.main' : 'transparent',
          '&:hover': { 
            color: isAdded ? 'success.main' : 'primary.main', 
            bgcolor: 'rgba(255,255,255,0.02)',
            borderColor: isAdded ? 'success.main' : 'transparent',
          },
          '&.Mui-disabled': {
            color: isAdded ? 'success.main' : 'text.disabled',
            borderColor: isAdded ? 'success.main' : 'transparent',
          }
        }}
      >
        {isAdded ? 'IN WATCHLIST' : 'ADD TO WATCHLIST'}
      </Button>

      {/* Rating Selection UI */}
      <RatingDialog 
        open={isRatingOpen}
        onClose={() => setIsRatingOpen(false)}
        onRate={handleRate}
        movieTitle={movie.title}
        isSubmitting={addRating.isPending}
      />
    </Box>
  );
};
