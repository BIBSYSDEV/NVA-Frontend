import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, SxProps, Tooltip, TooltipProps, Typography } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { FormikErrors, setNestedObjectValues, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { partialUpdateRegistration, updateRegistration } from '../../api/registrationApi';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { RegistrationFormLocationState } from '../../types/locationState.types';
import { Registration, RegistrationStatus, RegistrationTab } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { isPublishableForWorkflow2 } from '../../utils/formik-helpers/formik-helpers';
import { willResetNviStatuses } from '../../utils/nviHelpers';
import {
  getFormattedRegistration,
  updateRegistrationQueryData,
  userCanOnlyDoPartialUpdate,
  userHasAccessRight,
} from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { SupportModalContent } from './SupportModalContent';

interface RegistrationFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
  validateForm: (values: Registration) => FormikErrors<Registration>;
  persistedRegistration: Registration;
  isResettableNviStatus: boolean;
}

export const navigationButtonStyling: SxProps = {
  color: 'primary.main',
  borderRadius: '50%',
  bgcolor: 'tertiary.main',
  height: '1.875rem',
  width: '1.875rem',
};

export const RegistrationFormActions = ({
  tabNumber,
  setTabNumber,
  validateForm,
  persistedRegistration,
  isResettableNviStatus,
}: RegistrationFormActionsProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((store: RootState) => store.customer);

  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as RegistrationFormLocationState;

  const queryClient = useQueryClient();
  const { values, setTouched, resetForm, isValid } = useFormikContext<Registration>();

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);
  const [isSaving, setIsSaving] = useState(false);
  const [openNviApprovalResetDialog, setOpenNviApprovalResetDialog] = useState(false);

  const isFirstTab = tabNumber === RegistrationTab.Description;
  const isLastTab = tabNumber === RegistrationTab.FilesAndLicenses;

  const cancelEdit = () => {
    if (locationState?.previousPath) {
      navigate(-1);
    } else {
      navigate(getRegistrationLandingPagePath(values.identifier));
    }
  };

  const saveRegistration = async (values: Registration) => {
    setIsSaving(true);
    const formattedValues = getFormattedRegistration(values);
    const updateRegistrationResponse = userCanOnlyDoPartialUpdate(formattedValues)
      ? await partialUpdateRegistration(formattedValues)
      : await updateRegistration(formattedValues);
    const isSuccess = isSuccessStatus(updateRegistrationResponse.status);

    if (isErrorStatus(updateRegistrationResponse.status)) {
      const detail =
        updateRegistrationResponse.status === 412
          ? t('feedback.error.registration_update_precondition_failed')
          : undefined;
      dispatch(setNotification({ message: t('feedback.error.update_registration'), detail, variant: 'error' }));
      const newErrors = validateForm(values);
      setTouched(setNestedObjectValues(newErrors, true));
    } else if (isSuccess) {
      updateRegistrationQueryData(queryClient, updateRegistrationResponse.data);

      const newErrors = validateForm(updateRegistrationResponse.data);
      resetForm({
        values: updateRegistrationResponse.data,
        errors: newErrors,
        touched: setNestedObjectValues(newErrors, true),
      });

      // Add a fixed wait to ensure that Formik has updated the form before navigating.
      // Without this we experienced some issues with RouteLeavingGuard on some browsers (NP-47920).
      await new Promise((resolve) => setTimeout(resolve, 100));

      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));

      if (isLastTab) {
        if (locationState?.previousPath) {
          navigate(-1);
        } else {
          navigate(getRegistrationLandingPagePath(values.identifier));
        }
      }
    }
    setIsSaving(false);

    return isSuccess;
  };

  const handleSaveClick = async () => {
    if (isResettableNviStatus && (await willResetNviStatuses(persistedRegistration, values))) {
      setOpenNviApprovalResetDialog(true);
    } else {
      await saveRegistration(values);
    }
  };

  const disableSaving =
    (values.status === RegistrationStatus.Published || values.status === RegistrationStatus.PublishedMetadata) &&
    ((customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' && !isPublishableForWorkflow2(values)) ||
      (customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles' && !isValid));

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
        {!isFirstTab && (
          <Box sx={{ gridArea: 'back-button' }}>
            <Tooltip title={t('common.previous')}>
              <IconButton
                onClick={() => setTabNumber(tabNumber - 1)}
                data-testid={dataTestId.registrationWizard.formActions.previousTabButton}>
                <KeyboardArrowLeftIcon sx={navigationButtonStyling} />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {userHasAccessRight(persistedRegistration, 'support-request-create') && (
          <Button
            sx={{
              gridArea: 'support-button',
              width: 'fit-content',
              justifySelf: 'center',
            }}
            color="tertiary"
            variant="contained"
            size="small"
            data-testid={dataTestId.registrationWizard.formActions.openSupportButton}
            onClick={toggleSupportModal}>
            {t('my_page.messages.get_curator_support')}
          </Button>
        )}
        <Box
          sx={{
            gridArea: 'action-buttons',
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
          <Button
            color="tertiary"
            variant="contained"
            data-testid={dataTestId.registrationWizard.formActions.cancelEditButton}
            onClick={cancelEdit}>
            {t('common.cancel')}
          </Button>
          {!isLastTab ? (
            <>
              <TooltipButtonWrapper
                title={disableSaving && t('registration.cannot_update_published_result_with_validation_errors')}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={disableSaving}
                  loading={isSaving}
                  data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
                  onClick={handleSaveClick}>
                  {t('common.save')}
                </Button>
              </TooltipButtonWrapper>
              <Tooltip title={t('common.next')} sx={{ gridArea: 'next-button' }}>
                <IconButton
                  onClick={() => setTabNumber(tabNumber + 1)}
                  data-testid={dataTestId.registrationWizard.formActions.nextTabButton}>
                  <KeyboardArrowRightIcon sx={navigationButtonStyling} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <TooltipButtonWrapper
              title={disableSaving && t('registration.cannot_update_published_result_with_validation_errors')}>
              <Button
                color="secondary"
                variant="contained"
                disabled={disableSaving}
                loading={isSaving}
                data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
                onClick={handleSaveClick}>
                {t('common.save_and_view')}
              </Button>
            </TooltipButtonWrapper>
          )}
        </Box>
      </Box>

      <Modal
        maxWidth="md"
        fullWidth
        open={openSupportModal}
        onClose={toggleSupportModal}
        headingText={t('registration.support.need_help')}
        dataTestId={dataTestId.registrationWizard.formActions.supportModal}
        slotProps={{ paper: { sx: { bgcolor: 'white' } } }}>
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
        <Typography sx={{ mb: '1rem' }}>{t('registration.nvi_warning.approval_override_warning')}</Typography>
        <Typography>{t('registration.nvi_warning.confirm_saving_registration')}</Typography>
      </ConfirmDialog>
    </>
  );
};

// Wraps disabled buttons in <div> to ensure tooltips display correctly
const TooltipButtonWrapper = ({ children, title }: TooltipProps) =>
  title ? (
    <Tooltip title={title}>
      <div>{children}</div>
    </Tooltip>
  ) : (
    children
  );
