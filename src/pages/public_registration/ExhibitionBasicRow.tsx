import { ExhibitionBasic } from '../../types/publication_types/exhibitionContent.types';
import { getOutputName } from '../../utils/registration-helpers';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { PublicExhibitionBasicDialogContent } from './PublicPublicationContext';

interface ExhibitionBasicRowProps {
  exhibitManifestation: ExhibitionBasic;
}

export const ExhibitionBasicRow = ({ exhibitManifestation }: ExhibitionBasicRowProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => setOpenModal(!openModal);

  const nameString = getOutputName(exhibitManifestation);

  const rowString = exhibitManifestation.place?.name
    ? `${nameString} (${exhibitManifestation.place?.name})`
    : nameString;

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Typography>{rowString?.trim() || <i>{t('common.unknown')}</i>}</Typography>
      <Tooltip title={t('common.show_details')}>
        <IconButton size="small" color="primary" onClick={toggleModal} href={''} target="_blank">
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={openModal} onClose={toggleModal} fullWidth>
        <DialogTitle>{t('registration.resource_type.artistic.announcement')}</DialogTitle>
        <ErrorBoundary>
          <PublicExhibitionBasicDialogContent exhibitionBasic={exhibitManifestation as ExhibitionBasic} />
        </ErrorBoundary>
        <DialogActions>
          <Button variant="outlined" onClick={toggleModal}>
            {t('common.close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
