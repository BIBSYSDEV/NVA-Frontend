import BlockIcon from '@mui/icons-material/Block';
import { Box, Typography } from '@mui/material';
import { Trans } from 'react-i18next';

const NotFound = () => {
  return (
    <Box data-testid="404" sx={{ m: { xs: '4rem 1rem', sm: '4rem auto' } }}>
      <Trans
        i18nKey="feedback.error.404_page"
        components={{
          span: <span style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }} />,
          icon: <BlockIcon />,
          h1: <Typography variant="h1" />,
          p: <Typography />,
        }}
      />
    </Box>
  );
};

export default NotFound;
