import { ExhibitionBasic, ExhibitionCatalog } from '../../types/publication_types/exhibitionContent.types';
import { getOutputName } from '../../utils/registration-helpers';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { getIdentifierFromId } from '../../utils/general-helpers';
import { useFetchRegistration } from '../../api/hooks/useFetchRegistration';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { PublicExhibitionBasicDialogContent } from './PublicPublicationContext';

interface ExhibitionRowProps {
  exhibitManifestation: ExhibitionBasic | ExhibitionCatalog;
}

export const ExhibitionRow = ({ exhibitManifestation }: ExhibitionRowProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = () => setOpenModal(!openModal);

  const exhibitionCatalogIdentifier =
    exhibitManifestation.type === 'ExhibitionCatalog' && exhibitManifestation.id
      ? getIdentifierFromId(exhibitManifestation.id)
      : '';

  const exhibitionCatalogQuery = useFetchRegistration(exhibitionCatalogIdentifier);

  const nameString = exhibitionCatalogIdentifier
    ? exhibitionCatalogQuery.data?.entityDescription?.mainTitle
    : getOutputName(exhibitManifestation);

  const rowString =
    exhibitManifestation.type === 'ExhibitionBasic' && exhibitManifestation.place?.name
      ? `${nameString} (${exhibitManifestation.place.name})`
      : `${nameString} (${t(`registration.resource_type.artistic.output_type.${exhibitManifestation.type}` as any)})`;

  return (
    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Typography>{rowString?.trim() || <i>{t('common.unknown')}</i>}</Typography>
      <Tooltip title={t('common.show_details')}>
        <IconButton
          size="small"
          color="primary"
          onClick={exhibitionCatalogIdentifier ? undefined : toggleModal}
          href={exhibitionCatalogIdentifier ? getRegistrationLandingPagePath(exhibitionCatalogIdentifier) : ''}
          target="_blank">
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Dialog open={openModal} onClose={toggleModal} fullWidth>
        <DialogTitle>{t('registration.resource_type.artistic.announcement')}</DialogTitle>
        <ErrorBoundary>
          {exhibitManifestation.type === 'ExhibitionBasic' ? (
            <PublicExhibitionBasicDialogContent exhibitionBasic={exhibitManifestation as ExhibitionBasic} />
          ) : null}
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
