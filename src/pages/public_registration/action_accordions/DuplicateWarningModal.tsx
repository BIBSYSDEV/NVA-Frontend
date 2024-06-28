import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Modal } from '../../../components/Modal';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationLandingPagePath } from '../../../utils/urlPaths';

interface DuplicateWarningModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onConfirmNotDuplicate: () => void;
  duplicateId: string | undefined;
}

export const DuplicateWarningModal = ({
  isOpen,
  toggleModal,
  duplicateId,
  onConfirmNotDuplicate,
}: DuplicateWarningModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      open={isOpen}
      onClose={() => {
        toggleModal();
      }}
      maxWidth="xs"
      fullWidth={true}
      headingText={t('registration.public_page.duplicate_warning_modal.headline')}
      dataTestId={dataTestId.registrationLandingPage.duplicateRegistrationModal.duplicationModal}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography>{t('registration.public_page.duplicate_warning_modal.publication_already_exists')}</Typography>
        {duplicateId && (
          <Box>
            <Typography sx={{ display: 'inline' }}>
              {t('registration.public_page.duplicate_warning_modal.dont_create_duplicates_check_that')}
            </Typography>
            <Link
              target="_blank"
              data-testid={dataTestId.registrationLandingPage.duplicateRegistrationModal.duplicateRegistrationLink}
              to={getRegistrationLandingPagePath(duplicateId)}>
              <Box sx={{ gap: '0.25rem', display: 'inline-flex', mr: '0.25rem' }}>
                <Typography
                  sx={{ display: 'inline', textDecoration: 'underline', cursor: 'pointer', color: 'primary.light' }}>
                  {t('registration.public_page.duplicate_warning_modal.this_publication')}
                </Typography>
                <OpenInNewOutlinedIcon
                  sx={{
                    cursor: 'pointer',
                    color: 'primary.main',
                    height: '1.3rem',
                    width: '1.3rem',
                    display: 'inline',
                  }}
                />
              </Box>
            </Link>
            <Typography sx={{ display: 'inline' }}>
              {t('registration.public_page.duplicate_warning_modal.is_the_same_that_you_have_registered')}
            </Typography>
          </Box>
        )}
        <Typography sx={{ display: 'inline' }}>
          {t('registration.public_page.duplicate_warning_modal.if_same_press_no_in_box')}
        </Typography>
        <Typography sx={{ display: 'inline' }}>
          {t('registration.public_page.duplicate_warning_modal.contact_registrator_to_change')}
        </Typography>
        <Typography sx={{ display: 'inline', textAlign: 'center' }}>
          {t('registration.public_page.duplicate_warning_modal.confirm_not_duplicate')}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
          <Button
            data-testid={dataTestId.registrationLandingPage.duplicateRegistrationModal.duplicateRegistrationNoButton}
            variant="text"
            onClick={toggleModal}>
            {t('common.no')}
          </Button>
          <Button
            data-testid={dataTestId.registrationLandingPage.duplicateRegistrationModal.duplicateRegistrationYesButton}
            variant="outlined"
            onClick={onConfirmNotDuplicate}>
            {t('common.yes')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
