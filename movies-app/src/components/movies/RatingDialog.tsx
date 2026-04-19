import { type FC } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Box, 
  Typography, 
  Button, 
  IconButton,
  Tooltip
} from '@mui/material';

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  onRate: (rating: number) => void;
  movieTitle: string;
  isSubmitting?: boolean;
}

export const RatingDialog: FC<RatingDialogProps> = ({ 
  open, 
  onClose, 
  onRate, 
  movieTitle,
  isSubmitting 
}) => {
  const ratings = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRadius: 3,
            width: '100%',
            maxWidth: 400,
            backgroundImage: 'none',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>
          Rate Movie
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>
          ×
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pt: 1, pb: 4 }}>
        <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 700, mb: 3, textAlign: 'center' }}>
          {movieTitle.toUpperCase()}
        </Typography>

        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: 1.5,
          mt: 2
        }}>
          {ratings.map((rating) => (
            <Tooltip key={rating} title={`Rate ${rating}/10`} arrow>
              <Button
                variant="outlined"
                disabled={isSubmitting}
                onClick={() => {
                  onRate(rating);
                  onClose();
                }}
                sx={{
                  minWidth: 0,
                  width: '100%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  borderColor: 'rgba(245, 197, 24, 0.3)',
                  color: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'black',
                    borderColor: 'primary.main'
                  }
                }}
              >
                {rating}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
