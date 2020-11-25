import React, { FC, useState } from 'react';
import { Button } from '@material-ui/core';
import { setNestedObjectValues, useFormikContext } from 'formik';
import styled from 'styled-components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SaveIcon from '@material-ui/icons/Save';
import { useTranslation } from 'react-i18next';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { Registration, RegistrationTab } from '../../types/registration.types';
import Modal from '../../components/Modal';
import { SupportModalContent } from './SupportModalContent';

const StyledActionsContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;

  > div > button:not(:last-child) {
    margin-right: 0.5rem;
  }
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
      <StyledActionsContainer>
        <div>
          {/* Left aligned buttons */}
          {tabNumber !== RegistrationTab.Description && (
            <Button
              color="primary"
              variant="outlined"
              data-testid="button-previous-tab"
              startIcon={<ArrowBackIcon />}
              onClick={() => setTabNumber(tabNumber - 1)}>
              {t('common:previous')}
            </Button>
          )}
        </div>
        <div>
          {/* Right aligned buttons */}
          <Button data-testid="open-support-button" variant="text" color="primary" onClick={toggleSupportModal}>
            {t('common:support')}
          </Button>
          {tabNumber !== RegistrationTab.Submission ? (
            <>
              <ButtonWithProgress
                type="submit"
                variant="outlined"
                isLoading={isSaving}
                data-testid="button-save-registration"
                endIcon={<SaveIcon />}
                onClick={async () => {
                  await saveRegistration();
                  // Set all fields with error to touched to ensure error messages are shown
                  setTouched(setNestedObjectValues(errors, true));
                }}>
                {t('save_draft')}
              </ButtonWithProgress>
              <Button
                color="primary"
                variant="contained"
                data-testid="button-next-tab"
                endIcon={<ArrowForwardIcon />}
                onClick={() => setTabNumber(tabNumber + 1)}>
                {t('common:next')}
              </Button>
            </>
          ) : null}
        </div>
      </StyledActionsContainer>

      <Modal open={openSupportModal} onClose={toggleSupportModal} headingText={t('common:support')}>
        <SupportModalContent closeModal={toggleSupportModal} />
      </Modal>
    </>
  );
};
