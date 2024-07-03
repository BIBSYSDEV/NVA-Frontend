import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import { Box, Link as MuiLink, Typography } from '@mui/material';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { dataTestId } from '../../../utils/dataTestIds';
import { getRegistrationLandingPagePath } from '../../../utils/urlPaths';

interface DuplicateWarningModalProps {
  isOpen: boolean;
  toggleModal: () => void;
  onConfirmNotDuplicate: () => void;
  duplicateId?: string;
}

export const DuplicateWarningDialog = ({
  isOpen,
  toggleModal,
  duplicateId,
  onConfirmNotDuplicate,
}: DuplicateWarningModalProps) => {
  const { t } = useTranslation();

  return (
    <ConfirmDialog
      open={isOpen}
      title={t('registration.public_page.duplicate_warning_modal.headline')}
      onAccept={onConfirmNotDuplicate}
      onCancel={toggleModal}
      dialogDataTestId={dataTestId.registrationLandingPage.duplicateRegistrationModal.duplicationModal}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Typography>{t('registration.public_page.duplicate_warning_modal.publication_already_exists')}</Typography>
        {duplicateId && (
          <Typography>
            <Trans
              t={t}
              i18nKey="registration.public_page.duplicate_warning_modal.check_duplicate"
              components={[
                <MuiLink
                  component={Link}
                  target="_blank"
                  data-testid={dataTestId.registrationLandingPage.duplicateRegistrationModal.duplicateRegistrationLink}
                  to={getRegistrationLandingPagePath(duplicateId)}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'primary.light',
                  }}>
                  <OpenInNewOutlinedIcon fontSize="small" />
                </MuiLink>,
              ]}
            />
          </Typography>
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
      </Box>
    </ConfirmDialog>
  );
};
