import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ListPaginationCounterProps {
  start: number;
  end: number;
  total: number;
}

export const ListPaginationCounter = ({ start, end, total }: ListPaginationCounterProps) => {
  const { t } = useTranslation();

  return (
    <Typography>
      {t('common.pagination_showing_interval', {
        start: start.toLocaleString(),
        end: end.toLocaleString(),
        total: total.toLocaleString(),
      })}
    </Typography>
  );
};
