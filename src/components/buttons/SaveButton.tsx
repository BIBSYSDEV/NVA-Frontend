import { LoadingButton } from '@mui/lab';
import { ButtonBaseProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface SaveButtonProps extends ButtonBaseProps {
  testId: string;
  loading: boolean;
  text?: string;
}

export const SaveButton = ({ text, loading, onClick, testId, sx }: SaveButtonProps) => {
  const { t } = useTranslation();

  return (
    <LoadingButton
      variant="contained"
      sx={{ height: '2rem', ...sx }}
      loading={loading}
      data-testid={testId}
      onClick={onClick}>
      {text ? text : t('common.save')}
    </LoadingButton>
  );
};
