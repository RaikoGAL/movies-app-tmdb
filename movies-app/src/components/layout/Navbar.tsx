import { type FC } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Top Rated', path: '/top-rated' },
  { label: 'Search', path: '/search' },
];

export const Navbar: FC = () => {
  const location = useLocation();

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 64 }}>
          {/* Logo Branding */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'inherit',
              mr: 4,
            }}
          >
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 900,
                fontSize: '1.2rem',
                mr: 1,
              }}
            >
              ME
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: -0.5,
                display: { xs: 'none', md: 'block' },
                color: 'text.primary',
              }}
            >
              MovieExplorer
            </Typography>
          </Box>

          {/* Navigation Links */}
          <Box sx={{ display: 'flex', flexGrow: 1, gap: 1 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.path}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.primary',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'rgba(245, 197, 24, 0.08)',
                    },
                    borderBottom: isActive ? '2px solid' : '2px solid transparent',
                    borderRadius: 0,
                    height: 64,
                    px: 2,
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
