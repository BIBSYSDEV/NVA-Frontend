import React, { FC, useState } from 'react';
import { setNestedObjectValues, useFormikContext } from 'formik';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SaveIcon from '@material-ui/icons/Save';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { Registration, RegistrationStatus, RegistrationTab } from '../../types/registration.types';
import Modal from '../../components/Modal';
import { SupportModalContent } from './SupportModalContent';
import { updateRegistration } from '../../api/registrationApi';
import { NotificationVariant } from '../../types/notification.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';

const StyledActionsContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;

  > div > button:not(:last-child) {
    margin-right: 0.5rem;
  }
`;

interface RegistrationFormActionsProps {
  tabNumber: RegistrationTab;
  setTabNumber: (newTab: RegistrationTab) => void;
  refetchRegistration: () => void;
}

export const RegistrationFormActions: FC<RegistrationFormActionsProps> = ({
  tabNumber,
  setTabNumber,
  refetchRegistration,
}) => {
  const { t } = useTranslation('registration');
  const history = useHistory();
  const dispatch = useDispatch();
  const { values, errors, setTouched } = useFormikContext<Registration>();

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);
  const [isSaving, setIsSaving] = useState(false);

  const saveRegistration = async (values: Registration) => {
    setIsSaving(true);
    const updatedRegistration = await updateRegistration(values);
    if (updatedRegistration?.error) {
      dispatch(setNotification(updatedRegistration.error, NotificationVariant.Error));
    } else {
      refetchRegistration();
      dispatch(setNotification(t('feedback:success.update_registration')));
    }
    setIsSaving(false);
    return !updatedRegistration.error;
  };

  const onClickSaveAndPresent = async () => {
    const registrationIsUpdated = await saveRegistration(values);
    if (registrationIsUpdated) {
      history.push(getRegistrationLandingPagePath(values.identifier));
    }
  };

  return (
    <>
      <StyledActionsContainer>
        <div>
          {/* Left aligned buttons */}
          {tabNumber > RegistrationTab.Description && (
            <Button
              color="secondary"
              variant="outlined"
              data-testid="button-previous-tab"
              startIcon={<ArrowBackIcon />}
              onClick={() => setTabNumber(tabNumber - 1)}>
              <Typography variant="button">
                {tabNumber === RegistrationTab.Reference && t('heading.description')}
                {tabNumber === RegistrationTab.Contributors && t('heading.reference')}
                {tabNumber === RegistrationTab.FilesAndLicenses && t('heading.contributors')}
              </Typography>
            </Button>
          )}
        </div>
        <div>
          {/* Right aligned buttons */}
          <Button data-testid="open-support-button" variant="text" color="primary" onClick={toggleSupportModal}>
            <Typography variant="button">{t('common:support')}</Typography>
          </Button>
          {tabNumber < RegistrationTab.FilesAndLicenses ? (
            <>
              <ButtonWithProgress
                variant="outlined"
                isLoading={isSaving}
                data-testid="button-save-registration"
                endIcon={<SaveIcon />}
                onClick={async () => {
                  await saveRegistration(values);
                  // Set all fields with error to touched to ensure error messages are shown
                  setTouched(setNestedObjectValues(errors, true));
                }}>
                <Typography variant="button">
                  {values.status === RegistrationStatus.DRAFT ? t('save_draft') : t('common:save')}
                </Typography>
              </ButtonWithProgress>
              <Button
                color="secondary"
                variant="contained"
                data-testid="button-next-tab"
                endIcon={<ArrowForwardIcon />}
                onClick={() => setTabNumber(tabNumber + 1)}>
                <Typography variant="button">
                  {tabNumber === RegistrationTab.Description && t('heading.reference')}
                  {tabNumber === RegistrationTab.Reference && t('heading.contributors')}
                  {tabNumber === RegistrationTab.Contributors && t('heading.files_and_license')}
                </Typography>
              </Button>
            </>
          ) : (
            <ButtonWithProgress
              color="secondary"
              variant="contained"
              isLoading={isSaving}
              data-testid="button-save-registration"
              endIcon={<SaveIcon />}
              onClick={onClickSaveAndPresent}>
              <Typography variant="button">{t('common:save_and_present')}</Typography>
            </ButtonWithProgress>
          )}
        </div>
      </StyledActionsContainer>

      <Modal open={openSupportModal} onClose={toggleSupportModal} headingText={t('common:support')}>
        <SupportModalContent closeModal={toggleSupportModal} />
      </Modal>
    </>
  );
};
