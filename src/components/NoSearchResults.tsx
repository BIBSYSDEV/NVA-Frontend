import SearchIcon from '@mui/icons-material/Search';
import { Box, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';

interface NoSearchResultsProps {
  listKey?: string;
}

export const NoSearchResults = ({ listKey }: NoSearchResultsProps) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        alignItems: 'center',
        mt: '2rem',
        p: '1rem',
      }}>
      <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <SearchIcon />
        <Typography variant="h2">{t('common.no_hits')}</Typography>
      </Box>
      <Typography>{t('no_search_results_found_with_search')}</Typography>
      <div>
        <Typography fontWeight="bold">{t('tips_for_search')}</Typography>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <Trans
            defaults={listKey ?? 'no_search_results_list_default'}
            components={{
              li: <li />,
            }}
          />
        </ul>
      </div>
    </Box>
  );
};
