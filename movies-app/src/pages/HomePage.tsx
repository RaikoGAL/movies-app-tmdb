import { type FC } from 'react';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useAccount } from '../hooks/useAccount';
import { useWatchlistMovies } from '../hooks/useWatchlistMovies';
import { UserProfileCard } from '../components/account/UserProfileCard';
import { WatchlistSection } from '../components/account/WatchlistSection';

const HomePage: FC = () => {
  const { 
    data: account, 
    isLoading: isAccLoading, 
    isError: isAccError,
    error: accError 
  } = useAccount();

  const { 
    data: watchlist, 
    isLoading: isWatchLoading, 
    isError: isWatchError 
  } = useWatchlistMovies(account?.id);

  if (isAccLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isAccError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" variant="outlined">
          Error loading account details: {(accError as Error).message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        {/* Welcome Header */}
        <Box sx={{ mb: 8, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 900,
              letterSpacing: -2,
              color: 'text.primary',
              lineHeight: 1,
            }}
          >
            Welcome to <Box component="span" sx={{ color: 'primary.main' }}>MovieExplorer</Box>
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, mt: 2, maxWidth: 600 }}>
            Your premium destination for movie discovery and personal tracking.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
            gap: { xs: 4, lg: 6 },
            alignItems: 'start',
          }}
        >
          {/* Sidebar / Profile Section */}
          <Box sx={{ position: { md: 'sticky' }, top: 88 }}>
            {account && <UserProfileCard account={account} />}
          </Box>

          {/* Main / Watchlist Section */}
          <Box>
            <WatchlistSection 
              watchlist={watchlist} 
              isLoading={isWatchLoading} 
              isError={isWatchError} 
            />
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
