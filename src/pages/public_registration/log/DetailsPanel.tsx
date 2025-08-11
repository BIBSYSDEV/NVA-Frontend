import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Modal } from '../../../components/Modal';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { dataTestId } from '../../../utils/dataTestIds';
import { visuallyHidden } from '@mui/utils';

export const DetailsPanel = () => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '1rem',
        bgcolor: 'secondary.main',
        gap: '0.5rem',
      }}>
      <Typography variant="h2" sx={visuallyHidden}>
        {t('details')}
      </Typography>
      <Typography variant="h3">{t('point_of_contact')}</Typography>
      <Typography>{t('point_of_contact_description')}</Typography>
      <Button
        data-testid={dataTestId.registrationLandingPage.detailsTab.viewContactInformationButton}
        variant="contained"
        sx={{ textTransform: 'none', width: 'fit-content', alignSelf: { sm: 'start', md: 'center' } }}
        startIcon={<MailOutlineIcon />}
        onClick={() => setOpenModal(true)}>
        {t('view_contact_info')}
      </Button>
      <Modal
        data-testid={dataTestId.registrationLandingPage.detailsTab.contactModal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        headingText={t('points_of_contact_for_result')}
        maxWidth="sm">
        <Trans
          i18nKey="no_point_of_contact"
          components={{
            p: <Typography />,
            link1: (
              <OpenInNewLink
                data-testid={dataTestId.registrationLandingPage.detailsTab.infoLink}
                href="https://sikt.no/kontakt-oss"
              />
            ),
          }}
        />
      </Modal>
    </Box>
  );
};
