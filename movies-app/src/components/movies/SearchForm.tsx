import { useState, type FC, type FormEvent } from 'react';
import { Box, TextField, Button } from '@mui/material';

interface SearchFormProps {
  onSearch: (title: string, year?: number) => void;
  isLoading?: boolean;
}

export const SearchForm: FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(true);
      return;
    }
    setError(false);
    onSearch(title.trim(), year ? parseInt(year, 10) : undefined);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        alignItems: 'flex-start',
        mb: 4,
      }}
    >
      <TextField
        fullWidth
        label="Movie Name"
        placeholder="Enter movie title..."
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (e.target.value.trim()) setError(false);
        }}
        error={error}
        helperText={error ? 'Movie name is required' : ''}
        disabled={isLoading}
      />
      <TextField
        label="Year (Optional)"
        type="number"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        sx={{ minWidth: { sm: 150 } }}
        disabled={isLoading}
        slotProps={{
          input: {
            inputProps: { min: 1888, max: new Date().getFullYear() + 5 },
          },
        }}
      />
      <Button
        variant="contained"
        type="submit"
        size="large"
        disabled={isLoading}
        sx={{ height: 56, px: 4 }}
      >
        Search
      </Button>
    </Box>
  );
};
