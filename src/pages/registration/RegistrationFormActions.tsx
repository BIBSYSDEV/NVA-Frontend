import { FormikErrors, setNestedObjectValues, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { LoadingButton } from '@mui/lab';
import { useQueryClient } from '@tanstack/react-query';
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
  validateForm: (values: Registration) => FormikErrors<Registration>;
}

export const RegistrationFormActions = ({ tabNumber, setTabNumber, validateForm }: RegistrationFormActionsProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { values, setTouched } = useFormikContext<Registration>();

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
          gridTemplateAreas: "'back-button support-button save-button'",
          gridTemplateColumns: { xs: 'auto', sm: '1fr 1fr 1fr' },
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

        <Box sx={{ gridArea: 'support-button', display: 'flex', justifyContent: 'space-evenly' }}>
          <Button
            sx={{
              borderRadius: '15px 0px 15px 0px',
              bgcolor: 'white',
              border: '2px solid #4A7AC1',
              borderRight: '5px solid #4A7AC1',
              borderLeft: '5px solid #4A7AC1',
            }}
            size="small"
            data-testid={dataTestId.registrationWizard.formActions.openSupportButton}
            onClick={toggleSupportModal}>
            {t('registration.curator_support')}
          </Button>
        </Box>
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
              onClick={async () => await saveRegistration(values)}>
              {t('common.save')}
            </LoadingButton>
            <Box sx={{ gridArea: 'next-button' }}>
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
          </Box>
        ) : (
          <Box
            sx={{
              gridArea: 'save-button',
              display: 'flex',
              justifyContent: 'end',
            }}>
            <LoadingButton
              variant="contained"
              loading={isSaving}
              data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}
              onClick={onClickSaveAndPresent}
              sx={{ gridArea: 'save-button', width: 'fit-content' }}>
              {t('common.save_and_view')}
            </LoadingButton>
          </Box>
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
