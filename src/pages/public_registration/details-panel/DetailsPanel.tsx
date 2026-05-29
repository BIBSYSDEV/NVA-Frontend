import { Box, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { Registration } from '../../../types/registration.types';
import { CitationBox } from './_components/citation-box/CitationBox';
import { PointOfContact } from './_components/point-of-contact/PointOfContact';

interface DetailsPanelProps {
  registration: Registration;
}

export const DetailsPanel = ({ registration }: DetailsPanelProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: '1rem', bgcolor: 'background.paper', gap: '0.5rem' }}>
      <Typography variant="h2" sx={visuallyHidden}>
        {t('details')}
      </Typography>

      <BetaFunctionality>
        <CitationBox registration={registration} />
      </BetaFunctionality>

      <PointOfContact registration={registration} />
    </Box>
  );
};
