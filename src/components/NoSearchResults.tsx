import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { Trans } from 'react-i18next';

interface NoSearchResultsProps {
  children: ReactNode;
}

export const NoSearchResults = ({ children }: NoSearchResultsProps) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', m: '2rem 0.5rem' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
        <Trans
          i18nKey="no_search_results_found_with_search"
          components={{
            icon: <SearchIcon />,
            span: <span style={{ display: 'flex', gap: '0.5rem' }} />,
            heading: <Typography variant="h2" />,
            p: <Typography />,
          }}
        />
        {children && <div>{children}</div>}
      </Box>
    </Box>
  );
};
