import { TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { JournalType } from '../../../types/publicationFieldNames';
import { Registration } from '../../../types/registration.types';

const supportedInstanceTypes: string[] = [JournalType.AcademicArticle, JournalType.AcademicLiteratureReview];
const citationHeadingId = 'citation-box-heading';

interface CitationBoxProps {
  registration: Registration;
}

export const CitationBox = ({ registration }: CitationBoxProps) => {
  const { t } = useTranslation();
  const instanceType = registration.entityDescription?.reference?.publicationInstance?.type;

  if (!instanceType || !supportedInstanceTypes.includes(instanceType)) {
    return null;
  }

  const citation = `Otte, P. P., Adamsone-Fiskovica, A., Žabko, O., Kerge, K., Šūmane, S., Shvaichenko, S., Veveris, A., & Mincyte, D. (2025). A Qualitative Comparative Analysis of cross-sectoral bioresource residue flows from agriculture, forestry, and aquaculture: the crucial role of non-biobased sectors in the development of the circular bioeconomy. Frontiers in Sustainability, 6. https://doi.org/10.3389/frsus.2025.1490685`;

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
