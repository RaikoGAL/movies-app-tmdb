import { useState, useMemo, type FC } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Alert,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { SearchForm } from '../components/movies/SearchForm';
import { MovieActions } from '../components/movies/MovieActions';
import { useSearchMovies } from '../hooks/useMovies';
import { useAccount } from '../hooks/useAccount';
import type { Movie } from '../types/tmdb.types';

const SearchPage: FC = () => {
  const navigate = useNavigate();
  const { data: accountData } = useAccount();
  const accountId = accountData?.id;

  const [searchParams, setSearchParams] = useState<{ title: string; year?: number }>({
    title: '',
  });

  const { data, isLoading, isError, error, isFetching } = useSearchMovies(
    searchParams.title,
    searchParams.year
  );

  const handleSearch = (title: string, year?: number) => {
    setSearchParams({ title, year });
  };

  const displayedMovies = useMemo(() => {
    return data?.results?.slice(0, 10) ?? [];
  }, [data]);

  const handleViewSummary = () => {
    navigate('/summary', { state: { movies: displayedMovies } });
  };

  const hasResults = displayedMovies.length > 0;
  const isInitialState = !searchParams.title && !isLoading;
  const noResultsFound = searchParams.title && !isLoading && !hasResults;

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', borderLeft: '6px solid #f5c518', pl: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
            SEARCH MOVIES
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 2, mb: 6, border: '1px solid rgba(255,255,255,0.08)' }}>
          <SearchForm onSearch={handleSearch} isLoading={isLoading || isFetching} />
        </Box>

        {isInitialState && (
          <Box sx={{ textAlign: 'center', mt: 8, py: 10, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Search for a movie title to explore results.
            </Typography>
          </Box>
        )}

        {(isLoading || isFetching) && !isInitialState && (
          <Typography sx={{ textAlign: 'center', mt: 4, color: 'primary.main', fontWeight: 600 }}>
            Searching cinematic database...
          </Typography>
        )}

        {isError && (
          <Alert severity="error" variant="outlined" sx={{ mb: 4 }}>
            {(error as Error).message}
          </Alert>
        )}

        {noResultsFound && (
          <Alert severity="info" sx={{ mb: 4 }} variant="outlined">
            No movies found for "{searchParams.title}". Try adjusting your search query or year.
          </Alert>
        )}

        {hasResults && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Top {displayedMovies.length} results
              </Typography>
              <Button
                variant="contained"
                onClick={handleViewSummary}
                sx={{ px: 4, py: 1.5 }}
              >
                View Analytics Summary
              </Button>
            </Box>

            <Box sx={{ display: 'grid', gap: 3 }}>
              {displayedMovies.map((movie: Movie) => (
                <Card 
                  elevation={0} 
                  key={movie.id}
                  sx={{ 
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'border-color 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  {/* Result Poster */}
                  <Box
                    component={RouterLink}
                    to={`/movie/${movie.id}`}
                    sx={{
                      width: { xs: '100%', sm: 120 },
                      height: { xs: 200, sm: 180 },
                      flexShrink: 0,
                      bgcolor: '#333',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none'
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
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>NO POSTER</Typography>
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', md: '1fr auto' }, 
                      gap: 3, 
                      alignItems: 'start' 
                    }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Typography 
                            variant="h6" 
                            component={RouterLink}
                            to={`/movie/${movie.id}`}
                            sx={{ 
                              fontWeight: 800, 
                              color: 'text.primary', 
                              lineHeight: 1.2,
                              textDecoration: 'none',
                              '&:hover': { color: 'primary.main' }
                            }}
                          >
                            {movie.title}
                          </Typography>
                          <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 900, fontSize: '1rem' }}>
                            ★ {movie.vote_average.toFixed(1)}
                          </Typography>
                        </Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, mb: 2, display: 'block' }}>
                          RELEASE: {movie.release_date || 'Unknown'}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'text.secondary', 
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {movie.overview || 'Detailed overview is currently unavailable.'}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                        pt: { xs: 1, md: 0 }
                      }}>
                        <MovieActions movie={movie} accountId={accountId} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SearchPage;
