import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useFetchPublisherFromId } from '../../../../../api/hooks/useFetchPublisherFromId';
import { Registration } from '../../../../../types/registration.types';
import { useJournalSeoData } from '../../../../../utils/hooks/useJournalSeoData';
import { formatAPA } from './_utils/format-apa';

const citationHeadingId = 'citation-box-heading';

interface CitationBoxProps {
  registration: Registration;
}

export const CitationBox = ({ registration }: CitationBoxProps) => {
  const { t } = useTranslation();
  const { journalName } = useJournalSeoData(registration);

  const publicationContext = registration.entityDescription?.reference?.publicationContext;
  const publisherId =
    (publicationContext && 'publisher' in publicationContext && publicationContext.publisher?.id) || '';
  const publisherName = useFetchPublisherFromId(publisherId).data?.name ?? '';

  const citation = formatAPA(registration, { journalName, publisherName });

  if (!citation) {
    return null;
  }

  return (
    <>
      <Typography id={citationHeadingId} variant="h3">
        {t('citation')}
      </Typography>
      <TextField
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        value={citation}
        slotProps={{
          input: { readOnly: true },
          htmlInput: { 'aria-labelledby': citationHeadingId },
        }}
      />
    </>
  );
};
