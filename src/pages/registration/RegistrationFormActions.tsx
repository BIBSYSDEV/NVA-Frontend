import { setNestedObjectValues, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import { updateRegistration } from '../../api/registrationApi';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/actions/notificationActions';
import { Registration, RegistrationStatus, RegistrationTab } from '../../types/registration.types';
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
  const { t } = useTranslation('registration');
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
      dispatch(setNotification(t('feedback:error.update_registration'), 'error'));
      setIsSaving(false);
    } else if (isSuccess) {
      refetchRegistration();
      dispatch(setNotification(t('feedback:success.update_registration')));
    }

    return isSuccess;
  };

  const onClickSaveAndPresent = async () => {
    const registrationIsUpdated = await saveRegistration(values);
    if (registrationIsUpdated) {
      history.push(getRegistrationLandingPagePath(values.identifier));
    }
  };

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
            <Button
              variant="outlined"
              data-testid="button-previous-tab"
              startIcon={<ArrowBackIcon />}
              onClick={() => setTabNumber(tabNumber - 1)}>
              {tabNumber === RegistrationTab.ResourceType && t('heading.description')}
              {tabNumber === RegistrationTab.Contributors && t('heading.resource_type')}
              {tabNumber === RegistrationTab.FilesAndLicenses && t('heading.contributors')}
            </Button>
          </Box>
        )}
        <Button data-testid="open-support-button" onClick={toggleSupportModal} sx={{ gridArea: 'support-button' }}>
          {t('common:support')}
        </Button>
        {tabNumber < RegistrationTab.FilesAndLicenses ? (
          <Box
            sx={{
              gridArea: 'save-next-button',
              display: 'grid',
              gridTemplateAreas: '"save-button next-button"',
              columnGap: '1rem',
            }}>
            <LoadingButton
              variant="outlined"
              loading={isSaving}
              data-testid="button-save-registration"
              endIcon={<SaveIcon />}
              loadingPosition="end"
              onClick={async () => {
                await saveRegistration(values);
                // Set all fields with error to touched to ensure error messages are shown
                setTouched(setNestedObjectValues(errors, true));
              }}>
              {values.status === RegistrationStatus.Draft ? t('save_draft') : t('common:save')}
            </LoadingButton>
            <Button
              variant="contained"
              data-testid="button-next-tab"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setTabNumber(tabNumber + 1)}>
              {tabNumber === RegistrationTab.Description && t('heading.resource_type')}
              {tabNumber === RegistrationTab.ResourceType && t('heading.contributors')}
              {tabNumber === RegistrationTab.Contributors && t('heading.files_and_license')}
            </Button>
          </Box>
        ) : (
          <LoadingButton
            variant="contained"
            loading={isSaving}
            data-testid="button-save-registration"
            endIcon={<SaveIcon />}
            loadingPosition="end"
            onClick={onClickSaveAndPresent}
            sx={{ gridArea: 'save-next-button' }}>
            {t('common:save_and_present')}
          </LoadingButton>
        )}
      </Box>

      <Modal
        open={openSupportModal}
        onClose={toggleSupportModal}
        headingText={t('common:support')}
        dataTestId="support-modal">
        <SupportModalContent closeModal={toggleSupportModal} />
      </Modal>
    </>
  );
};
