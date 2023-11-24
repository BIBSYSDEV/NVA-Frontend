import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
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
import { Registration, RegistrationTab } from '../../types/registration.types';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { getFormattedRegistration } from '../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { SupportModalContent } from './SupportModalContent';

interface RegistrationFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
  validateForm: (values: Registration) => FormikErrors<Registration>;
  hasChangedNviValues: boolean;
}

export const RegistrationFormActions = ({
  tabNumber,
  setTabNumber,
  validateForm,
  hasChangedNviValues,
}: RegistrationFormActionsProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { values, setTouched } = useFormikContext<Registration>();

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);
  const [isSaving, setIsSaving] = useState(false);
  const [openNviApprovalResetDialog, setOpenNviApprovalResetDialog] = useState(false);

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
      const newErrors = validateForm(updateRegistrationResponse.data);
      setTouched(setNestedObjectValues(newErrors, true));
      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));
    }
    setIsSaving(false);

    return isSuccess;
  };

  const onClickSaveAndPresent = async () => {
    if (hasChangedNviValues) {
      setOpenNviApprovalResetDialog(true);
    } else {
      const registrationIsUpdated = await saveRegistration(values);
      if (registrationIsUpdated) {
        history.push(getRegistrationLandingPagePath(values.identifier));
      }
    }
  };

  const isFirstTab = tabNumber === RegistrationTab.Description;
  const isLastTab = tabNumber === RegistrationTab.FilesAndLicenses;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: "'back-button support-button save-button'",
          gridTemplateColumns: '1fr 1fr 1fr',
          alignItems: 'center',
          gap: '1rem',
        }}>
        {!isFirstTab && (
          <Box sx={{ gridArea: 'back-button' }}>
            <Tooltip title={t('common.previous')}>
              <IconButton
                onClick={() => setTabNumber(tabNumber - 1)}
                data-testid={dataTestId.registrationWizard.formActions.previousTabButton}>
                <KeyboardArrowLeftIcon
                  sx={{
                    color: 'white',
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    height: '1.875rem',
                    width: '1.875rem',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        )}
        <Button
          sx={{
            height: '1.375rem',
            bgcolor: 'white',
            borderStyle: 'solid',
            borderRadius: '8px 0px',
            borderWidth: '1px 5px',
            borderColor: 'generalSupportCase.main',
            gridArea: 'support-button',
            width: 'fit-content',
            justifySelf: 'center',
          }}
          size="small"
          data-testid={dataTestId.registrationWizard.formActions.openSupportButton}
          onClick={toggleSupportModal}>
          {t('my_page.messages.types.GeneralSupportCase')}
        </Button>
        {!isLastTab ? (
          <Box
            sx={{
              gridArea: 'save-button',
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}>
            <LoadingButton
              variant="outlined"
              loading={isSaving}
              data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
              onClick={async () => {
                hasChangedNviValues ? setOpenNviApprovalResetDialog(true) : await saveRegistration(values);
              }}>
              {t('common.save')}
            </LoadingButton>
            <Tooltip title={t('common.next')} sx={{ gridArea: 'next-button' }}>
              <IconButton
                onClick={() => setTabNumber(tabNumber + 1)}
                data-testid={dataTestId.registrationWizard.formActions.nextTabButton}>
                <KeyboardArrowRightIcon
                  sx={{
                    color: 'white',
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    height: '1.875rem',
                    width: '1.875rem',
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <LoadingButton
            variant="contained"
            loading={isSaving}
            data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
            onClick={onClickSaveAndPresent}
            sx={{ gridArea: 'save-button', width: 'fit-content', justifySelf: 'end' }}>
            {t('common.save_and_view')}
          </LoadingButton>
        )}
      </Box>

      <Modal
        maxWidth="md"
        fullWidth
        open={openSupportModal}
        onClose={toggleSupportModal}
        headingText={t('my_page.messages.types.GeneralSupportCase')}
        dataTestId={dataTestId.registrationWizard.formActions.supportModal}>
        <SupportModalContent closeModal={toggleSupportModal} registration={values} />
      </Modal>

      <ConfirmDialog
        open={openNviApprovalResetDialog}
        title={'NVI GODKJENNING'}
        onAccept={async () => {
          if (tabNumber === RegistrationTab.FilesAndLicenses) {
            const registrationIsUpdated = await saveRegistration(values);
            if (registrationIsUpdated) {
              setOpenNviApprovalResetDialog(false);
              history.push(getRegistrationLandingPagePath(values.identifier));
            }
          } else {
            setOpenNviApprovalResetDialog(false);
            saveRegistration(values);
          }
        }}
        onCancel={() => setOpenNviApprovalResetDialog(false)}>
        <Typography>{'Om du lagrer vil du nullstille alle NVI godkjenninger'}</Typography>
      </ConfirmDialog>
    </>
  );
};
