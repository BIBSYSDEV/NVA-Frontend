import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { LabeledSpinner } from '../../../../../../components/_molecules/LabeledSpinner';
import { mathJaxContentClassName } from '../../../../../../utils/mathJaxHelpers';

interface ReferenceContentProps {
  reference: string;
  isLoading: boolean;
  isError: boolean;
  showFormulas: boolean;
}

export const ReferenceContent = ({ reference, isLoading, isError, showFormulas }: ReferenceContentProps) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <LabeledSpinner label={t('fetching_reference')} />;
  }

  if (isError) {
    return <Typography>{t('feedback.error.get_reference')}</Typography>;
  }

  // NOTE: MathJax replaces the text React rendered, so the key makes React render a new element when the reference
  // changes, instead of updating text that is no longer in the page
  return (
    <Typography key={reference} className={showFormulas ? mathJaxContentClassName : undefined}>
      {reference}
    </Typography>
  );
};
