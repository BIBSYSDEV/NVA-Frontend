import { Button, SxProps } from '@mui/material';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface CancelEditButtonProps {
  previousPathState?: string;
  sx: SxProps;
}

const CancelEditButton = ({ previousPathState, sx }: CancelEditButtonProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  const checkAndGoBack = () => {
    if (previousPathState) {
      history.push(previousPathState);
    } else {
      history.push('/');
    }
  };

  return (
    <Button onClick={checkAndGoBack} color="primary" sx={sx}>
      {t('common.cancel')}
    </Button>
  );
};

export default CancelEditButton;
