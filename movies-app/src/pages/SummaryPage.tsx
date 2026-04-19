import { useMemo, type FC } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import {
  Typography,
  Container,
  Box,
  Card,
  CardContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useGenres } from '../hooks/useGenres';
import type { Movie, Genre } from '../types/tmdb.types';

// Cinematic chart colors (pop on black)
const COLORS = ['#f5c518', '#00C49F', '#FF8042', '#8884d8', '#0088FE'];

interface SummaryLocationState {
  movies?: Movie[];
}

const SummaryPage: FC = () => {
  const location = useLocation();
  const state = location.state as SummaryLocationState;
  const movies = state?.movies;

  const { data: genresData, isLoading, isError } = useGenres();

  if (!movies || movies.length === 0) {
    return <Navigate to="/" replace />;
  }

  const averageRating = useMemo(() => {
    const total = movies.reduce((acc, m) => acc + m.vote_average, 0);
    return (total / movies.length).toFixed(1);
  }, [movies]);

  const genreChartData = useMemo(() => {
    if (!genresData?.genres) return [];

    const genreCounts: Record<number, number> = {};
    movies.forEach((movie) => {
      movie.genre_ids.forEach((id) => {
        genreCounts[id] = (genreCounts[id] || 0) + 1;
      });
    });

    const entries = Object.entries(genreCounts).map(([id, count]) => {
      const genre = genresData.genres.find((g: Genre) => g.id === parseInt(id));
      return {
        name: genre?.name || 'Unknown',
        value: count,
      };
    });

    return entries
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [movies, genresData]);

  const yearChartData = useMemo(() => {
    const yearCounts: Record<string, number> = {};
    movies.forEach((movie) => {
      const year = movie.release_date?.split('-')[0];
      // Only include valid 4-digit numeric years
      if (year && /^\d{4}$/.test(year)) {
        yearCounts[year] = (yearCounts[year] || 0) + 1;
      }
    });

    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [movies]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error" variant="outlined">Failed to load movie analytics metadata.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', borderLeft: '6px solid #f5c518', pl: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
            ANALYTICS SUMMARY
          </Typography>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary', fontWeight: 500 }}>
          Statistical breakdown of the top {movies.length} movies from your latest discovery.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '300px 1fr' }, gap: 4, mb: 4 }}>
          {/* Average Rating Card */}
          <Card elevation={0} sx={{ height: 'fit-content', border: '1px solid rgba(255,255,10,0.1)' }}>
            <CardContent sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 2 }}>
                Avg Score
              </Typography>
              <Typography variant="h1" sx={{ fontWeight: 900, color: 'primary.main', my: 1 }}>
                {averageRating}
              </Typography>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                CRITIC AVG / 10
              </Typography>
            </CardContent>
          </Card>

          {/* Genre Pie Chart */}
          <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                Genre Distribution
              </Typography>
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genreChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                      stroke="none"
                    >
                      {genreChartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                      itemStyle={{ color: '#fff', fontWeight: 800 }}
                      formatter={(value: number) => [`${value} Movies`, 'Count']}
                    />
                    <Legend iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Release Year Chart */}
        <Card elevation={0} sx={{ mt: 4, border: '1px solid rgba(255,255,255,0.08)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>
              Release Timeline
            </Typography>
            <Box sx={{ height: 350, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="year" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#b3b3b3', fontSize: 12, fontWeight: 600 }}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#b3b3b3', fontSize: 12, fontWeight: 600 }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    itemStyle={{ color: '#f5c518', fontWeight: 800 }}
                    formatter={(value: number) => [`${value} Movies`, 'Volume']}
                    labelStyle={{ color: '#aaa', marginBottom: 4, fontWeight: 700 }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#f5c518" 
                    name="Movies" 
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default SummaryPage;
