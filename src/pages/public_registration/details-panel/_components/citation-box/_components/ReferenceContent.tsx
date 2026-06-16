import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LabeledSpinner } from '../../../../../../components/_molecules/LabeledSpinner';

interface ReferenceContentProps {
  citation: string;
  isLoading: boolean;
  isError: boolean;
}

export const ReferenceContent = ({ citation, isLoading, isError }: ReferenceContentProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <LabeledSpinner label={t('fetching_reference')} />;
  }

  if (isError) {
    return <Typography>{t('feedback.error.get_reference')}</Typography>;
  }

  return <Typography>{citation}</Typography>;
};
