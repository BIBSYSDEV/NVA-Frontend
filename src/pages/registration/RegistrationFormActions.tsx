import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, SxProps, Tooltip, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { FormikErrors, setNestedObjectValues, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { updateRegistration } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationFormLocationState } from '../../types/locationState.types';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { willResetNviStatuses } from '../../utils/nviHelpers';
import { getFormattedRegistration } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath, UrlPathTemplate } from '../../utils/urlPaths';
import { SupportModalContent } from './SupportModalContent';

interface RegistrationFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
  validateForm: (values: Registration) => FormikErrors<Registration>;
  persistedRegistration: Registration;
  isNviCandidate: boolean;
}

export const RegistrationFormActions = ({
  tabNumber,
  setTabNumber,
  validateForm,
  persistedRegistration,
  isNviCandidate,
}: RegistrationFormActionsProps) => {
  const { t } = useTranslation();
  const history = useHistory<RegistrationFormLocationState>();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { values, setTouched, resetForm } = useFormikContext<Registration>();

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);
  const [isSaving, setIsSaving] = useState(false);
  const [openNviApprovalResetDialog, setOpenNviApprovalResetDialog] = useState(false);

  const isFirstTab = tabNumber === RegistrationTab.Description;
  const isLastTab = tabNumber === RegistrationTab.FilesAndLicenses;

  const navigationButtonStyling: SxProps = {
    color: 'white',
    borderRadius: '50%',
    bgcolor: 'primary.main',
    height: '1.875rem',
    width: '1.875rem',
  };

  const cancelEdit = () => {
    if (history.location.state?.previousPath) {
      history.goBack();
    } else {
      history.push(UrlPathTemplate.Home);
    }
  };

  const saveRegistration = async (values: Registration) => {
    setIsSaving(true);
    const formattedValues = getFormattedRegistration(values);
    const updateRegistrationResponse = await updateRegistration(formattedValues);
    const isSuccess = isSuccessStatus(updateRegistrationResponse.status);
    if (isErrorStatus(updateRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' }));
      const newErrors = validateForm(values);
      setTouched(setNestedObjectValues(newErrors, true));
    } else if (isSuccess) {
      queryClient.setQueryData(
        ['registration', updateRegistrationResponse.data.identifier],
        updateRegistrationResponse.data
      );
      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));

      const newErrors = validateForm(updateRegistrationResponse.data);
      resetForm({
        values: updateRegistrationResponse.data,
        errors: newErrors,
        touched: setNestedObjectValues(newErrors, true),
      });

      if (isLastTab) {
        if (history.location.state?.previousPath) {
          history.goBack();
        } else {
          history.push(getRegistrationLandingPagePath(values.identifier));
        }
      }
    }
    setIsSaving(false);

    return isSuccess;
  };

  const handleSaveClick = async () => {
    if (isNviCandidate && (await willResetNviStatuses(persistedRegistration, values))) {
      setOpenNviApprovalResetDialog(true);
    } else {
      await saveRegistration(values);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: {
            xs: "'back-button . action-buttons' 'support-button support-button support-button'",
            md: "'back-button  support-button  action-buttons'",
          },
          gridTemplateColumns: { xs: 'auto auto auto', md: '1fr 1fr 1fr' },
          alignItems: 'center',
          gap: '1rem',
        }}>
        <Box sx={{ gridArea: 'back-button' }}>
          <Tooltip title={!isFirstTab ? t('common.previous') : ''}>
            <IconButton
              disabled={isFirstTab}
              onClick={() => setTabNumber(tabNumber - 1)}
              data-testid={dataTestId.registrationWizard.formActions.previousTabButton}>
              <KeyboardArrowLeftIcon sx={{ ...navigationButtonStyling, opacity: isFirstTab ? 0.5 : 1 }} />
            </IconButton>
          </Tooltip>
        </Box>

        <Button
          sx={{
            gridArea: 'support-button',
            width: 'fit-content',
            justifySelf: 'center',
          }}
          variant="contained"
          size="small"
          data-testid={dataTestId.registrationWizard.formActions.openSupportButton}
          onClick={toggleSupportModal}>
          {t('my_page.messages.get_curator_support')}
        </Button>

        <Box
          sx={{
            gridArea: 'action-buttons',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
          <Button data-testid={dataTestId.registrationWizard.formActions.cancelEditButton} onClick={cancelEdit}>
            {t('common.cancel')}
          </Button>
          {!isLastTab ? (
            <LoadingButton
              variant="outlined"
              loading={isSaving}
              data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
              onClick={handleSaveClick}>
              {t('common.save')}
            </LoadingButton>
          ) : (
            <LoadingButton
              variant="contained"
              loading={isSaving}
              data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
              onClick={handleSaveClick}>
              {t('common.save_and_view')}
            </LoadingButton>
          )}
          <Tooltip title={!isLastTab ? t('common.next') : ''}>
            <span>
              <IconButton
                disabled={isLastTab}
                onClick={() => setTabNumber(tabNumber + 1)}
                data-testid={dataTestId.registrationWizard.formActions.nextTabButton}>
                <KeyboardArrowRightIcon sx={{ ...navigationButtonStyling, opacity: isLastTab ? 0.5 : 1 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Modal
        maxWidth="md"
        fullWidth
        open={openSupportModal}
        onClose={toggleSupportModal}
        headingText={t('registration.support.need_help')}
        dataTestId={dataTestId.registrationWizard.formActions.supportModal}
        PaperProps={{ sx: { bgcolor: 'generalSupportCase.light', padding: '1rem' } }}>
        <SupportModalContent closeModal={toggleSupportModal} registration={values} />
      </Modal>

      <ConfirmDialog
        open={openNviApprovalResetDialog}
        title={t('registration.nvi_warning.registration_is_included_in_nvi')}
        onAccept={async () => {
          setOpenNviApprovalResetDialog(false);
          await saveRegistration(values);
        }}
        onCancel={() => setOpenNviApprovalResetDialog(false)}>
        <Typography paragraph>{t('registration.nvi_warning.approval_override_warning')}</Typography>
        <Typography>{t('registration.nvi_warning.confirm_saving_registration')}</Typography>
      </ConfirmDialog>
    </>
  );
};
