import { setNestedObjectValues, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LoadingButton } from '@mui/lab';
import { updateRegistration } from '../../api/registrationApi';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { SupportModalContent } from './SupportModalContent';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getFormattedRegistration } from '../../utils/registration-helpers';
import { dataTestId } from '../../utils/dataTestIds';

interface RegistrationFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
  refetchRegistration: () => void;
}

export const RegistrationFormActions = ({
  tabNumber,
  setTabNumber,
  refetchRegistration,
}: RegistrationFormActionsProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { values, errors, setTouched } = useFormikContext<Registration>();

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);
  const [isSaving, setIsSaving] = useState(false);

  const saveRegistration = async (values: Registration) => {
    setIsSaving(true);
    const formattedValues = getFormattedRegistration(values);
    const updateRegistrationResponse = await updateRegistration(formattedValues);
    const isSuccess = isSuccessStatus(updateRegistrationResponse.status);
    if (isErrorStatus(updateRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.update_registration'), variant: 'error' }));
      setIsSaving(false);
    } else if (isSuccess) {
      refetchRegistration();
      dispatch(setNotification({ message: t('feedback.success.update_registration'), variant: 'success' }));
    }

    return isSuccess;
  };

  const onClickSaveAndPresent = async () => {
    const registrationIsUpdated = await saveRegistration(values);
    if (registrationIsUpdated) {
      history.push(getRegistrationLandingPagePath(values.identifier));
    }
  };

  const isFirstTab = tabNumber === RegistrationTab.Description;
  const isLastTab = tabNumber === RegistrationTab.FilesAndLicenses;

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateAreas: {
            xs: "'support-button save-button' 'back-button next-button'",
            sm: '"back-button support-button save-button next-button"',
          },
          gridTemplateColumns: { xs: '1fr 1fr', sm: '2fr auto auto' },
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

        <Box sx={{ gridArea: 'support-button', display: 'flex', justifyContent: 'start' }}>
          <Button
            data-testid={dataTestId.registrationWizard.formActions.openSupportButton}
            onClick={toggleSupportModal}>
            {t('common.support')}
          </Button>
        </Box>
        {!isLastTab ? (
          <>
            <Box
              sx={{
                gridArea: 'save-button',
                display: 'flex',
                justifyContent: 'end',
              }}>
              <LoadingButton
                variant="outlined"
                loading={isSaving}
                data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
                onClick={async () => {
                  await saveRegistration(values);
                  // Set all fields with error to touched to ensure error messages are shown
                  setTouched(setNestedObjectValues(errors, true));
                }}>
                {t('common.save')}
              </LoadingButton>
            </Box>
            <Box sx={{ gridArea: 'next-button', display: 'flex', justifyContent: 'end' }}>
              <Tooltip title={t('common.next')}>
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
          </>
        ) : (
          <LoadingButton
            variant="contained"
            loading={isSaving}
            data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
            onClick={onClickSaveAndPresent}
            sx={{ gridArea: 'save-button' }}>
            {t('common.save_and_view')}
          </LoadingButton>
        )}
      </Box>

      <Modal
        open={openSupportModal}
        onClose={toggleSupportModal}
        headingText={t('common.support')}
        dataTestId={dataTestId.registrationWizard.formActions.supportModal}>
        <SupportModalContent closeModal={toggleSupportModal} registrationId={values.id} />
      </Modal>
    </>
  );
};
