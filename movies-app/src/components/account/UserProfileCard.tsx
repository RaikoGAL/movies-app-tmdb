import { type FC } from 'react';
import { Card, CardContent, Avatar, Typography, Box } from '@mui/material';
import type { Account } from '../../types/tmdb.types';

interface UserProfileCardProps {
  account: Account;
}

export const UserProfileCard: FC<UserProfileCardProps> = ({ account }) => {
  const { name, username, avatar } = account;

  const tmdbAvatarPath = avatar?.tmdb?.avatar_path;
  const gravatarHash = avatar?.gravatar?.hash;

  const avatarUrl = tmdbAvatarPath
    ? `https://image.tmdb.org/t/p/w200${tmdbAvatarPath}`
    : gravatarHash
    ? `https://www.gravatar.com/avatar/${gravatarHash}?s=200`
    : null;

  const initial = (name || username || '?')[0].toUpperCase();

  return (
    <Card elevation={0} sx={{ border: '1px solid rgba(255,255,255,0.1)' }}>
      <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', height: 80, borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
      <CardContent sx={{ pt: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: -5,
            mb: 2,
          }}
        >
          <Avatar
            src={avatarUrl || undefined}
            sx={{
              width: 100,
              height: 100,
              border: '4px solid #1a1a1a',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              fontSize: '2.5rem',
              fontWeight: 800,
              mb: 2,
            }}
          >
            {initial}
          </Avatar>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 800 }}>
            {name || 'User'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            @{username}
          </Typography>
        </Box>
        
        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2, px: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', display: 'block' }}>
            Movie Explorer Member
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
