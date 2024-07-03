import ExpandMore from '@mui/icons-material/ExpandMore';
import { LoadingButton } from '@mui/lab';
import { Paper } from '@mui/material';
import { HTMLAttributes, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AutocompletePaperProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
  hasMoreHits: boolean;
  onShowMoreHits: () => void;
  isLoadingMoreHits: boolean;
}

export const AutocompletePaper = ({
  children,
  hasMoreHits,
  onShowMoreHits,
  isLoadingMoreHits,
  ...paperProps
}: AutocompletePaperProps) => {
  const { t } = useTranslation();

  return (
    <Paper {...paperProps}>
      {children}
      {hasMoreHits && (
        <LoadingButton
          sx={{ m: '0.5rem' }}
          endIcon={<ExpandMore />}
          loading={isLoadingMoreHits}
          onClick={onShowMoreHits}>
          {t('common.show_more')}
        </LoadingButton>
      )}
    </Paper>
  );
};
