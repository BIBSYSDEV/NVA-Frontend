import { Box, Paper, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchBibtexCitation } from '../../../../../api/hooks/useFetchBibtexCitation';
import { Registration } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { CopyCitationButton } from './_components/CopyCitationButton';
import { ReferenceContent } from './_components/ReferenceContent';
import {
  getReferenceFormatTabId,
  ReferenceFormat,
  referenceFormatPanelId,
  ReferenceFormatToggle,
} from './_components/ReferenceFormatToggle';
import { useApaCitation } from './_hooks/useApaCitation';
import { getReferenceDisplayState } from './_utils/reference-display';

const citationHeadingId = 'citation-box-heading';

interface CitationBoxProps {
  registration: Registration;
}

export const CitationBox = ({ registration }: CitationBoxProps) => {
  const { t } = useTranslation();
  const citation = useApaCitation(registration);

  const [format, setFormat] = useState<ReferenceFormat>('plain');
  const isBibtex = format === 'bibtex';

  const bibtexQuery = useFetchBibtexCitation(registration.identifier, isBibtex);
  const {
    citation: activeCitation,
    isLoading,
    isError,
    isCopyDisabled,
  } = getReferenceDisplayState(format, citation, bibtexQuery);

  if (!citation) {
    return null;
  }

  return (
    <Box component="section" display="flex" flexDirection="column">
      <Typography id={citationHeadingId} variant="h3" gutterBottom>
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
        <ReferenceContent citation={activeCitation} isLoading={isLoading} isError={isError} />
      </Paper>
      <CopyCitationButton citation={activeCitation} disabled={isCopyDisabled} />
    </Box>
  );
};
