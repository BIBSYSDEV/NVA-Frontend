import { setNestedObjectValues, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { LoadingButton } from '@mui/lab';
import { updateRegistration } from '../../api/registrationApi';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/notificationSlice';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { SupportModalContent } from './SupportModalContent';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { getFormattedRegistration } from '../../utils/registration-helpers';

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
          mb: '1rem',
          display: 'grid',
          gridTemplateAreas: {
            xs: "'save-next-button save-next-button' 'back-button support-button'",
            sm: '"back-button support-button save-next-button"',
          },
          gridTemplateColumns: { xs: '1fr 1fr', sm: '2fr auto auto' },
          alignItems: 'center',
          gap: '1rem',
        }}>
        {tabNumber > RegistrationTab.Description && (
          <Box sx={{ gridArea: 'back-button' }}>
            <IconButton onClick={() => setTabNumber(tabNumber - 1)} disabled={isFirstTab}>
              <Box
                sx={{
                  bgcolor: isFirstTab ? 'gray' : 'info.main',
                  display: 'flex',
                  borderRadius: '50%',
                  padding: '0.2rem',
                }}>
                <ChevronLeftIcon sx={{ color: 'white' }} />
              </Box>
            </IconButton>
          </Box>
        )}

        <Button data-testid="open-support-button" onClick={toggleSupportModal} sx={{ gridArea: 'support-button' }}>
          {t('common.support')}
        </Button>
        {tabNumber < RegistrationTab.FilesAndLicenses ? (
          <>
            <Box
              sx={{
                gridArea: 'save-next-button',
                display: 'grid',
                gridTemplateAreas: '"save-button next-button next-tab-button"',
                columnGap: '1rem',
                alignItems: 'center',
              }}>
              <LoadingButton
                sx={{ height: '80%' }}
                variant="outlined"
                loading={isSaving}
                data-testid="button-save-registration"
                onClick={async () => {
                  await saveRegistration(values);
                  // Set all fields with error to touched to ensure error messages are shown
                  setTouched(setNestedObjectValues(errors, true));
                }}>
                {t('common.save')}
              </LoadingButton>
              <IconButton
                sx={{ gridArea: 'next-tab-button' }}
                onClick={() => setTabNumber(tabNumber + 1)}
                disabled={isLastTab}>
                <Box
                  sx={{
                    bgcolor: isLastTab ? 'gray' : 'info.main',
                    display: 'flex',
                    borderRadius: '50%',
                    padding: '0.2rem',
                  }}>
                  <ChevronRightIcon sx={{ color: 'white' }} />
                </Box>
              </IconButton>
            </Box>
          </>
        ) : (
          <LoadingButton
            variant="contained"
            loading={isSaving}
            data-testid="button-save-registration"
            onClick={onClickSaveAndPresent}
            sx={{ gridArea: 'save-next-button' }}>
            {t('common.save_and_present')}
          </LoadingButton>
        )}
      </Box>

      <Modal
        open={openSupportModal}
        onClose={toggleSupportModal}
        headingText={t('common.support')}
        dataTestId="support-modal">
        <SupportModalContent closeModal={toggleSupportModal} registrationId={values.id} />
      </Modal>
    </>
  );
};
