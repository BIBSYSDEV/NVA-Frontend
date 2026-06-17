import { Box, Divider, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../types/registration.types';
import { PointOfContact } from './_components/point-of-contact/PointOfContact';
import { ReferenceBox } from './_components/reference-box/ReferenceBox';

interface DetailsPanelProps {
  registration: Registration;
}

export const DetailsPanel = ({ registration }: DetailsPanelProps) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: '1rem', bgcolor: 'background.paper', gap: '1rem' }}>
      <Typography variant="h2" sx={visuallyHidden}>
        {t('details')}
      </Typography>

      <ReferenceBox registration={registration} />

      <Divider />

      <PointOfContact registration={registration} />
    </Box>
  );
};
