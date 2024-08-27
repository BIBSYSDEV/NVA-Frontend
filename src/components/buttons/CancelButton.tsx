import { Button, ButtonBaseProps } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface CancelButtonProps extends ButtonBaseProps {
  testId: string;
}

export const CancelButton = ({ onClick, testId, sx }: CancelButtonProps) => {
  const { t } = useTranslation();

  return (
    <Button
      sx={{
        width: 'fit-content',
        ...sx,
      }}
      variant="text"
      size="small"
      data-testid={testId}
      onClick={onClick}>
      {t('common.cancel')}
    </Button>
  );
};
