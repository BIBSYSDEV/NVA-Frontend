import { setNestedObjectValues, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
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
          display: 'grid',
          gridTemplateAreas: {
            xs: "'back-button next-button' 'support-button save-button'",
            sm: '"back-button support-button save-button next-button"',
          },
          gridTemplateColumns: { xs: '1fr 1fr', sm: '2fr auto auto' },
          alignItems: 'center',
          gap: '1rem',
        }}>
        {!isFirstTab && (
          <Box sx={{ gridArea: 'back-button' }}>
            <Tooltip title={t('common.previous')}>
              <IconButton onClick={() => setTabNumber(tabNumber - 1)}>
                <ChevronLeftIcon
                  sx={{ color: 'white', borderRadius: '50%', bgcolor: 'info.main', height: '2rem', width: '2rem' }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        <Box sx={{ gridArea: 'support-button', display: 'flex', justifyContent: { xs: 'start' } }}>
          <Button data-testid="open-support-button" onClick={toggleSupportModal}>
            {t('common.support')}
          </Button>
        </Box>
        {!isLastTab ? (
          <>
            <Box
              sx={{
                gridArea: 'save-button',
                display: 'flex',
                justifyContent: { xs: 'end' },
              }}>
              <LoadingButton
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
            </Box>
            <Box sx={{ gridArea: 'next-button', display: 'flex', justifyContent: { xs: 'end' } }}>
              <Tooltip title={t('common.next')}>
                <IconButton onClick={() => setTabNumber(tabNumber + 1)}>
                  <ChevronRightIcon
                    sx={{ color: 'white', borderRadius: '50%', bgcolor: 'info.main', height: '2rem', width: '2rem' }}
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </>
        ) : (
          <LoadingButton
            variant="contained"
            loading={isSaving}
            data-testid="button-save-registration"
            onClick={onClickSaveAndPresent}
            sx={{ gridArea: 'save-button' }}>
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
