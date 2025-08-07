import { Box, Typography } from '@mui/material';

export const DetailsPanel = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '0.5rem',
        bgcolor: 'secondary.main',
        gap: '0.5rem',
      }}>
      <Typography variant="h2">Kontaktpunkt</Typography>
    </Box>
  );
};
