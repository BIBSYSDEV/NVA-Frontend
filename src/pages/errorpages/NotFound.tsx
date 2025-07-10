import BlockIcon from '@mui/icons-material/Block';
import { Box, Typography } from '@mui/material';
import { Trans } from 'react-i18next';

const NotFound = () => {
  return (
    <Box data-testid="404" sx={{ m: '4rem 2rem' }}>
      <Trans
        i18nKey="feedback.error.404_page"
        components={{
          span: <span style={{ display: 'flex', gap: '0.5rem' }} />,
          icon: <BlockIcon />,
          h1: <Typography gutterBottom variant="h2" component="h1" />,
          p: <Typography />,
        }}
      />
    </Box>
  );
};

export default NotFound;
