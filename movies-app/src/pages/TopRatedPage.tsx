import { useMemo, useEffect, useRef, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Container, Box, Alert, Avatar, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { useTopRatedMoviesInfinite } from '../hooks/useMovies';
import { useAccount } from '../hooks/useAccount';
import { MovieActions } from '../components/movies/MovieActions';
import type { Movie } from '../types/tmdb.types';

const TopRatedPage: FC = () => {
  const navigate = useNavigate();
  const { data: accountData } = useAccount();
  const accountId = accountData?.id;
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useTopRatedMoviesInfinite();

  // IntersectionObserver for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const movies = useMemo(() => 
    data?.pages.flatMap((page) => page.results) ?? [], 
  [data]);

  const columns = useMemo<MRT_ColumnDef<Movie>[]>(
    () => [
      {
        accessorKey: 'poster_path',
        header: 'Poster',
        size: 80,
        enableSorting: false,
        Cell: ({ cell, row }) => (
          <Box component={RouterLink} to={`/movie/${row.original.id}`} sx={{ display: 'block', textDecoration: 'none' }}>
            <Avatar
              variant="rounded"
              src={cell.getValue<string>() ? `https://image.tmdb.org/t/p/w92${cell.getValue<string>()}` : undefined}
              alt={row.original.title}
              sx={{ 
                width: 45, 
                height: 68, 
                bgcolor: '#333',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'scale(1.05)' }
              }}
            >
              {row.original.title[0]}
            </Avatar>
          </Box>
        ),
      },
      {
        accessorKey: 'title',
        header: 'Title',
        size: 250,
        Cell: ({ cell, row }) => (
          <Box component={RouterLink} to={`/movie/${row.original.id}`} sx={{ textDecoration: 'none' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', '&:hover': { color: 'primary.main' } }}>
              {cell.getValue<string>()}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {row.original.release_date?.split('-')[0] || 'N/A'}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'vote_average',
        header: 'Rating',
        size: 100,
        Cell: ({ cell }) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 900 }}>
              ★ {cell.getValue<number>().toFixed(1)}
            </Typography>
          </Box>
        ),
      },
      {
        accessorKey: 'overview',
        header: 'Overview',
        size: 350,
        Cell: ({ cell }) => (
          <Typography
            variant="caption"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              color: 'text.secondary',
              lineHeight: 1.4,
            }}
          >
            {cell.getValue<string>()}
          </Typography>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        size: 200,
        Cell: ({ row }) => (
          <Box sx={{ scale: '0.9', originX: 'right' }}>
            <MovieActions movie={row.original} accountId={accountId} />
          </Box>
        ),
      },
    ],
    [accountId]
  );

  const table = useMaterialReactTable({
    columns,
    data: movies,
    enablePagination: false, // Hide all default pagination controls
    manualPagination: true, // We handle the loading manually
    state: {
      isLoading,
      showAlertBanner: isError,
    },
    // Cinematic Table Styling
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        bgcolor: 'transparent',
        backgroundImage: 'none',
      },
    },
    muiTableContainerProps: {
      sx: {
        // Remove fixed height to allow page-level infinite scroll
        maxHeight: 'none',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      onClick: (event) => {
        const target = event.target as HTMLElement;
        if (target.closest('button') || target.closest('a')) {
          return;
        }
        navigate(`/movie/${row.original.id}`);
      },
      sx: {
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
          bgcolor: 'rgba(255,255,255,0.05) !important',
        },
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      },
    }),
    muiTableHeadCellProps: {
      sx: {
        bgcolor: '#121212',
        color: 'text.secondary',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase',
      },
    },
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableSorting: false,
  });

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 6 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', borderLeft: '6px solid #f5c518', pl: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: -1 }}>
            TOP RATED MOVIES
          </Typography>
        </Box>

        {isError && (
          <Alert severity="error" variant="outlined" sx={{ mb: 4 }}>
            Error: {(error as Error).message}
          </Alert>
        )}

        <Box sx={{ mt: 2, bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <MaterialReactTable table={table} />
          
          {/* Scroll Sentinel & Loading Indicator */}
          <Box 
            ref={sentinelRef} 
            sx={{ 
              py: 4, 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: 100 
            }}
          >
            {isFetchingNextPage ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={24} color="primary" />
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  Loading more movies...
                </Typography>
              </Box>
            ) : !hasNextPage && movies.length > 0 ? (
              <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                You've reached the end of the top rated selection.
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default TopRatedPage;
