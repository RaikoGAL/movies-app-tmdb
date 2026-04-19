import { type FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  Button, 
  Chip, 
  Divider,
  Paper
} from '@mui/material';
import { useMovieDetails } from '../hooks/useMovies';
import { useAccount } from '../hooks/useAccount';
import { MovieActions } from '../components/movies/MovieActions';

const MovieDetailsPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = parseInt(id || '0');
  
  const { data: movie, isLoading, isError, error } = useMovieDetails(movieId);
  const { data: account } = useAccount();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError || !movie) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" variant="outlined">
          {isError ? (error as Error).message : 'Movie not found'}
        </Alert>
        <Button 
          startIcon={<Typography sx={{ mr: 0.5 }}>←</Typography>} 
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const releaseYear = movie.release_date?.split('-')[0] || 'N/A';
  const backdropUrl = movie.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Box>
      {/* Hero Backdrop Section */}
      <Box 
        sx={{ 
          height: { xs: 300, md: 500 },
          width: '100%',
          position: 'relative',
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          display: 'flex',
          alignItems: 'flex-end',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%)',
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', pb: 4, zIndex: 1 }}>
          <Button 
            startIcon={<Typography sx={{ mr: 0.5 }}>←</Typography>} 
            onClick={() => navigate(-1)}
            sx={{ color: 'white', mb: 4, bgcolor: 'rgba(0,0,0,0.4)', '&:hover': { bgcolor: 'rgba(0,0,0,0.6)' } }}
          >
            Back
          </Button>
          <Typography variant="h2" sx={{ fontWeight: 900, color: 'white', letterSpacing: -1, lineHeight: 1.1 }}>
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 900 }}>
              ★ {movie.vote_average.toFixed(1)}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
              {releaseYear}
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Content Section */}
      <Container maxWidth="lg" sx={{ mt: -8, position: 'relative', zIndex: 2, pb: 10 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '350px 1fr' }, gap: 6 }}>
          {/* Left Column: Poster & Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Paper 
              elevation={24} 
              sx={{ 
                borderRadius: 2, 
                overflow: 'hidden',
                lineHeight: 0,
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              {posterUrl ? (
                <Box 
                  component="img" 
                  src={posterUrl} 
                  alt={movie.title}
                  sx={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : (
                <Box sx={{ height: 500, bgcolor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="h6" color="text.secondary">NO POSTER</Typography>
                </Box>
              )}
            </Paper>
            
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', p: 3, borderRadius: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 900, letterSpacing: 1, color: 'text.secondary' }}>
                YOUR ACTIONS
              </Typography>
              <MovieActions movie={movie} accountId={account?.id} />
            </Box>
          </Box>

          {/* Right Column: Details */}
          <Box sx={{ pt: { xs: 0, md: 10 } }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
              {movie.genres?.map(genre => (
                <Chip 
                  key={genre.id} 
                  label={genre.name} 
                  variant="outlined" 
                  sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'text.secondary', fontWeight: 600 }}
                />
              ))}
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
              Overview
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary', 
                lineHeight: 1.8, 
                fontSize: '1.1rem',
                mb: 4
              }}
            >
              {movie.overview || 'No overview provided.'}
            </Typography>

            <Divider sx={{ mb: 4, borderColor: 'rgba(255,255,255,0.1)' }} />

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 4 }}>
              <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}>
                  RELEASE DATE
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {movie.release_date || 'Unknown'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}>
                  ORIGINAL RATING
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {movie.vote_average.toFixed(1)} / 10
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: 1 }}>
                  VOTE COUNT
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {movie.vote_count || 0}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MovieDetailsPage;
