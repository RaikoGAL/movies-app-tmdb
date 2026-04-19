import { Suspense, lazy, type FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Box, CircularProgress } from '@mui/material';

// Lazy loading pages
const HomePage = lazy(() => import('./pages/HomePage'));
const TopRatedPage = lazy(() => import('./pages/TopRatedPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SummaryPage = lazy(() => import('./pages/SummaryPage'));
const MovieDetailsPage = lazy(() => import('./pages/MovieDetailsPage'));

const App: FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Suspense fallback={
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <CircularProgress />
          </Box>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/top-rated" element={<TopRatedPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/movie/:id" element={<MovieDetailsPage />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  );
};

export default App;
