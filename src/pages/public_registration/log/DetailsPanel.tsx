import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button, Typography } from '@mui/material';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Modal } from '../../../components/Modal';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { dataTestId } from '../../../utils/dataTestIds';

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
      <Typography sx={{ fontWeight: 'bold' }}>{t('registration.public_page.details_tab.point_of_contact')}</Typography>
      <Typography>{t('registration.public_page.details_tab.point_of_contact_description')}</Typography>
      <Button
        data-testid={dataTestId.registrationLandingPage.detailsTab.viewContactInformationButton}
        variant="contained"
        sx={{ textTransform: 'none', mx: 'auto' }}
        startIcon={<MailOutlineIcon />}
        onClick={() => setOpenModal(true)}>
        {t('registration.public_page.details_tab.view_contact_info')}
      </Button>
      <Modal
        data-testid={dataTestId.registrationLandingPage.detailsTab.contactModal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        headingText={t('registration.public_page.details_tab.points_of_contact_for_result')}
        sx={{ minWidth: { sm: 'fit-content', md: '40rem' } }}>
        <Trans
          i18nKey="registration.public_page.details_tab.no_point_of_contact"
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
