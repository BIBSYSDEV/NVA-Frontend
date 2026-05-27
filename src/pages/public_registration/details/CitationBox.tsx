import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { JournalType } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';

const supportedInstanceTypes: string[] = [JournalType.AcademicArticle, JournalType.AcademicLiteratureReview];

interface CitationBoxProps {
  registration: Registration;
}

export const CitationBox = ({ registration }: CitationBoxProps) => {
  const { t } = useTranslation();
  const instanceType = registration.entityDescription?.reference?.publicationInstance?.type;

  if (!instanceType || !supportedInstanceTypes.includes(instanceType)) {
    return null;
  }

  const citation = '';

  return (
    <TextField
      fullWidth
      multiline
      minRows={3}
      maxRows={6}
      value={citation}
      slotProps={{
        input: { readOnly: true },
        htmlInput: { 'aria-label': t('citation') },
      }}
    />
  );
};
