import React, { FC, useState } from 'react';
import { Button } from '@material-ui/core';
import { setNestedObjectValues, useFormikContext } from 'formik';
import styled from 'styled-components';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { DoiRequestStatus, Registration, RegistrationStatus, RegistrationTab } from '../../types/registration.types';
import Modal from '../../components/Modal';
import { SupportModalContent } from './SupportModalContent';
import { publishRegistration } from '../../api/registrationApi';
import { NotificationVariant } from '../../types/notification.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { RootStore } from '../../redux/reducers/rootReducer';

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
  saveRegistration: (values: Registration) => Promise<boolean>;
}

export const RegistrationFormActions: FC<RegistrationFormActionsProps> = ({
  tabNumber,
  setTabNumber,
  isSaving,
  saveRegistration,
}) => {
  const { t } = useTranslation('registration');
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const { values, errors, setTouched, dirty, isValid } = useFormikContext<Registration>();
  const { status, doiRequest } = values;

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);
  const [isPublishing, setIsPublishing] = useState(false);

  const onClickPublish = async () => {
    setIsPublishing(true);
    const RegistrationIsUpdated = dirty ? await saveRegistration(values) : true;
    if (RegistrationIsUpdated) {
      const publishedRegistration = await publishRegistration(values.identifier);
      if (publishedRegistration?.error) {
        setIsPublishing(false);
        dispatch(setNotification(publishedRegistration.error, NotificationVariant.Error));
      } else {
        history.push(`/registration/${values.identifier}/public`);
      }
    }
  };

  const onClickSaveAndPresent = async () => {
    const registrationIsUpdated = await saveRegistration(values);
    if (registrationIsUpdated) {
      history.push(`/registration/${values.identifier}/public`);
    }
  };

  const onClickCreateDoi = () => {
    // TODO: create doi here
  };

  const onClickRejectDoi = () => {
    // TODO: reject doi here
  };

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
              {tabNumber === RegistrationTab.Reference && t('heading.description')}
              {tabNumber === RegistrationTab.Contributors && t('heading.reference')}
              {tabNumber === RegistrationTab.FilesAndLicenses && t('heading.contributors')}
              {tabNumber === RegistrationTab.Submission && t('heading.files_and_license')}
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
                variant="outlined"
                isLoading={isSaving}
                data-testid="button-save-registration"
                endIcon={<SaveIcon />}
                onClick={async () => {
                  await saveRegistration(values);
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
                {tabNumber === RegistrationTab.Description && t('heading.reference')}
                {tabNumber === RegistrationTab.Reference && t('heading.contributors')}
                {tabNumber === RegistrationTab.Contributors && t('heading.files_and_license')}
                {tabNumber === RegistrationTab.FilesAndLicenses && t('heading.summary')}
              </Button>
            </>
          ) : (
            <>
              {user.isCurator && doiRequest?.status === DoiRequestStatus.Requested && (
                <>
                  <Button
                    color="primary"
                    variant="contained"
                    data-testid="button-create-doi"
                    onClick={onClickCreateDoi}
                    disabled={isSaving || !isValid}>
                    {t('common:create_doi')}
                  </Button>
                  <Button
                    color="secondary"
                    variant="outlined"
                    data-testid="button-reject-doi"
                    onClick={onClickRejectDoi}
                    disabled={isSaving || !isValid}>
                    {t('common:reject_doi')}
                  </Button>
                </>
              )}

              <ButtonWithProgress
                variant={status === RegistrationStatus.PUBLISHED ? 'contained' : 'outlined'}
                disabled={isPublishing}
                isLoading={isSaving}
                data-testid="button-save-registration"
                endIcon={<SaveIcon />}
                onClick={onClickSaveAndPresent}>
                {t('common:save_and_present')}
              </ButtonWithProgress>

              {status === RegistrationStatus.DRAFT && (
                <ButtonWithProgress
                  disabled={isSaving || !isValid}
                  data-testid="button-publish-registration"
                  endIcon={<CloudUploadIcon />}
                  onClick={onClickPublish}
                  isLoading={isPublishing}>
                  {t('common:publish')}
                </ButtonWithProgress>
              )}
            </>
          )}
        </div>
      </StyledActionsContainer>

      <Modal open={openSupportModal} onClose={toggleSupportModal} headingText={t('common:support')}>
        <SupportModalContent closeModal={toggleSupportModal} />
      </Modal>
    </>
  );
};
