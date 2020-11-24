import React, { FC, useState } from 'react';
import { Button } from '@material-ui/core';
import { setNestedObjectValues, useFormikContext } from 'formik';
import styled from 'styled-components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { Registration, RegistrationTab } from '../../types/registration.types';
import Modal from '../../components/Modal';
import { SupportModalContent } from './SupportModalContent';

const StyledButtonGroupContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
`;

const StyledButtonContainer = styled.div`
  display: inline-block;
  margin-left: 0.5rem;
`;

interface RegistrationFormActionsProps {
  tabNumber: number;
  setTabNumber: (newTab: number) => void;
  isSaving: boolean;
  saveRegistration: () => Promise<boolean>;
}

export const RegistrationFormActions: FC<RegistrationFormActionsProps> = ({
  tabNumber,
  setTabNumber,
  isSaving,
  saveRegistration,
}) => {
  const { t } = useTranslation('registration');
  const { errors, setTouched } = useFormikContext<Registration>();
  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);

  return (
    <>
      {tabNumber !== RegistrationTab.Submission ? (
        <StyledButtonGroupContainer>
          {tabNumber !== RegistrationTab.Description && (
            <Button
              color="primary"
              variant="contained"
              data-testid="button-previous-tab"
              startIcon={<ArrowBackIcon />}
              onClick={() => setTabNumber(tabNumber - 1)}>
              {t('common:previous')}
            </Button>
          )}
          <Button data-testid="open-support-button" variant="text" color="primary" onClick={toggleSupportModal}>
            {t('common:support')}
          </Button>
          <StyledButtonContainer>
            <ButtonWithProgress
              type="submit"
              variant="outlined"
              isLoading={isSaving}
              data-testid="button-save-registration"
              onClick={async () => {
                await saveRegistration();
                // Set all fields with error to touched to ensure error messages are shown
                setTouched(setNestedObjectValues(errors, true));
              }}>
              {t('save_draft')}
            </ButtonWithProgress>
          </StyledButtonContainer>
          <StyledButtonContainer>
            <Button
              color="primary"
              variant="contained"
              data-testid="button-next-tab"
              endIcon={<ArrowForwardIcon />}
              onClick={() => setTabNumber(tabNumber + 1)}>
              {t('common:next')}
            </Button>
          </StyledButtonContainer>
        </StyledButtonGroupContainer>
      ) : null}
      <Modal open={openSupportModal} onClose={toggleSupportModal} headingText={t('common:support')}>
        <SupportModalContent closeModal={toggleSupportModal} />
      </Modal>
    </>
  );
};
