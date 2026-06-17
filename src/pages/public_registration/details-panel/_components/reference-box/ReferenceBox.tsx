import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchBibtexReference } from '../../../../../api/hooks/useFetchBibtexReference';
import { Registration } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { CopyReferenceButton } from './_components/CopyReferenceButton';
import { ReferenceContent } from './_components/ReferenceContent';
import {
  getReferenceFormatTabId,
  ReferenceFormat,
  referenceFormatPanelId,
  ReferenceFormatToggle,
} from './_components/ReferenceFormatToggle';
import { useApaCitation } from './_hooks/useApaCitation';
import { getReferenceDisplayState } from './_utils/reference-display';

const referenceHeadingId = 'reference-box-heading';

interface ReferenceBoxProps {
  registration: Registration;
}

export const ReferenceBox = ({ registration }: ReferenceBoxProps) => {
  const { t } = useTranslation();
  const apaCitation = useApaCitation(registration);

  const [format, setFormat] = useState<ReferenceFormat>('plain');
  const isBibtex = format === 'bibtex';

  const bibtexQuery = useFetchBibtexReference(registration.identifier, isBibtex);
  const { reference, isLoading, isError, isCopyDisabled } = getReferenceDisplayState(format, apaCitation, bibtexQuery);

  if (!apaCitation) {
    return null;
  }

  return (
    <Box component="section" display="flex" flexDirection="column">
      <Typography id={referenceHeadingId} variant="h3" gutterBottom>
        {t('reference')}
      </Typography>
      <ReferenceFormatToggle value={format} onChange={setFormat} />
      <Paper
        data-testid={dataTestId.registrationLandingPage.detailsTab.referenceTextBox}
        variant="outlined"
        role="tabpanel"
        id={referenceFormatPanelId}
        tabIndex={0}
        aria-labelledby={getReferenceFormatTabId(format)}
        aria-busy={isLoading}
        sx={{ p: '1rem', maxHeight: '12rem', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
        <ReferenceContent reference={reference} isLoading={isLoading} isError={isError} />
      </Paper>
      <CopyReferenceButton reference={reference} disabled={isCopyDisabled} />
    </Box>
  );
};
