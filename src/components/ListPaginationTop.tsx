import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ListPaginationTopProps {
  pageCounterComponent: ReactNode;
  sortingComponent?: ReactNode;
}

export const ListPaginationTop = ({ pageCounterComponent, sortingComponent }: ListPaginationTopProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', mx: { xs: '0.5rem', md: 0 } }}>
      {pageCounterComponent}
      {sortingComponent && (
        <Box sx={{ display: 'flex' }}>
          <Typography>&nbsp;{t('search.sorted_by').toLowerCase()}&nbsp;</Typography>
          {sortingComponent}
        </Box>
      )}
    </Box>
  );
};
