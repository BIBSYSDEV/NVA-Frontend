import { setNestedObjectValues, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SaveIcon from '@mui/icons-material/Save';
import { updateRegistration } from '../../api/registrationApi';
import { ButtonWithProgress } from '../../components/ButtonWithProgress';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { Registration, RegistrationStatus, RegistrationTab } from '../../types/registration.types';
import { getRegistrationLandingPagePath } from '../../utils/urlPaths';
import { SupportModalContent } from './SupportModalContent';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';

const StyledActionsContainer = styled.div`
  margin-bottom: 1rem;
  display: grid;
  grid-template-areas: 'back-button support-button save-next-button';
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'save-next-button save-next-button' 'back-button support-button';
    row-gap: 1rem;
  }
  grid-template-columns: 2fr auto auto;
  column-gap: 1rem;
`;

const StyledBackButtonContainer = styled.div`
  grid-area: back-button;
`;

const StyledSaveNextButtonsContainer = styled.div`
  grid-area: save-next-button;
  display: grid;
  grid-template-areas: 'save-button next-button';
  grid-column-gap: 1rem;
`;

const StyledSupportButtonContainer = styled.div`
  grid-area: support-button;
`;

const StyledSaveAndPresentButtonContainer = styled.div`
  grid-area: save-next-button;
`;

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
    const updateRegistrationResponse = await updateRegistration(values);
    const isSuccess = isSuccessStatus(updateRegistrationResponse.status);
    if (isErrorStatus(updateRegistrationResponse.status)) {
      dispatch(setNotification(t('feedback:error.update_registration'), NotificationVariant.Error));
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
      <StyledActionsContainer>
        {tabNumber > RegistrationTab.Description && (
          <StyledBackButtonContainer>
            <Button
              color="secondary"
              variant="outlined"
              data-testid="button-previous-tab"
              startIcon={<ArrowBackIcon />}
              onClick={() => setTabNumber(tabNumber - 1)}>
              {tabNumber === RegistrationTab.ResourceType && t('heading.description')}
              {tabNumber === RegistrationTab.Contributors && t('heading.resource_type')}
              {tabNumber === RegistrationTab.FilesAndLicenses && t('heading.contributors')}
            </Button>
          </StyledBackButtonContainer>
        )}
        <StyledSupportButtonContainer>
          <Button data-testid="open-support-button" variant="text" color="primary" onClick={toggleSupportModal}>
            {t('common:support')}
          </Button>
        </StyledSupportButtonContainer>
        {tabNumber < RegistrationTab.FilesAndLicenses ? (
          <StyledSaveNextButtonsContainer>
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
              {values.status === RegistrationStatus.Draft ? t('save_draft') : t('common:save')}
            </ButtonWithProgress>
            <Button
              color="secondary"
              variant="contained"
              data-testid="button-next-tab"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setTabNumber(tabNumber + 1)}>
              {tabNumber === RegistrationTab.Description && t('heading.resource_type')}
              {tabNumber === RegistrationTab.ResourceType && t('heading.contributors')}
              {tabNumber === RegistrationTab.Contributors && t('heading.files_and_license')}
            </Button>
          </StyledSaveNextButtonsContainer>
        ) : (
          <StyledSaveAndPresentButtonContainer>
            <ButtonWithProgress
              color="secondary"
              variant="contained"
              isLoading={isSaving}
              data-testid="button-save-registration"
              endIcon={<SaveIcon />}
              onClick={onClickSaveAndPresent}>
              {t('common:save_and_present')}
            </ButtonWithProgress>
          </StyledSaveAndPresentButtonContainer>
        )}
      </StyledActionsContainer>

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
