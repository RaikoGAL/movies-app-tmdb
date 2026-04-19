import { type FC } from 'react';
import { Typography, Box, Card, CardContent, Stack, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import type { Movie, PaginatedResponse } from '../../types/tmdb.types';

interface WatchlistSectionProps {
  watchlist?: PaginatedResponse<Movie>;
  isLoading: boolean;
  isError: boolean;
}

export const WatchlistSection: FC<WatchlistSectionProps> = ({ watchlist, isLoading, isError }) => {
  const movies = watchlist?.results || [];

  if (isError) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error" variant="outlined">Failed to load your watchlist.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: { xs: 4, md: 0 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, borderLeft: '4px solid #f5c518', pl: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
          YOUR WATCHLIST
        </Typography>
      </Box>

      {!isLoading && movies.length === 0 && (
        <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)' }}>
          <Typography color="text.secondary">
            Your watchlist is empty. Explore and add movies you want to watch.
          </Typography>
        </Card>
      )}

      <Stack spacing={2.5}>
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <Card key={i} sx={{ minHeight: 140, bgcolor: 'rgba(255,255,255,0.05)', border: 'none' }} />
          ))
        ) : (
          movies.map((movie) => (
            <Card 
              key={movie.id} 
              component={RouterLink}
              to={`/movie/${movie.id}`}
              sx={{ 
                display: 'flex', 
                overflow: 'hidden',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': {
                  transform: 'translateX(4px)',
                  borderColor: 'primary.main',
                }
              }}
            >
              <Box
                sx={{
                  width: 90,
                  height: 135,
                  flexShrink: 0,
                  bgcolor: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {movie.poster_path ? (
                  <Box
                    component="img"
                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                    alt={movie.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', px: 1 }}>
                    NO POSTER
                  </Typography>
                )}
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 2, '&:last-child': { pb: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}>
                    {movie.title}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 0.5,
                      bgcolor: 'rgba(245, 197, 24, 0.1)',
                      color: 'primary.main',
                      px: 0.8,
                      py: 0.3,
                      borderRadius: 1,
                      border: '1px solid rgba(245, 197, 24, 0.2)'
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>
                      ★ {movie.vote_average.toFixed(1)}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    fontSize: '0.85rem',
                    lineHeight: 1.4,
                  }}
                >
                  {movie.overview || 'No overview available.'}
                </Typography>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
};
