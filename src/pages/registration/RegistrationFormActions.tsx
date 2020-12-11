import React, { FC, useState } from 'react';
import { setNestedObjectValues, useFormikContext } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SaveIcon from '@material-ui/icons/Save';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import deepmerge from 'deepmerge';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import {
  DoiRequestStatus,
  emptyRegistration,
  Registration,
  RegistrationStatus,
  RegistrationTab,
} from '../../types/registration.types';
import Modal from '../../components/Modal';
import { SupportModalContent } from './SupportModalContent';
import { getRegistration, publishRegistration, updateRegistration } from '../../api/registrationApi';
import { NotificationVariant } from '../../types/notification.types';
import { setNotification } from '../../redux/actions/notificationActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import { updateDoiRequest } from '../../api/doiRequestApi';

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
  handleSetRegistration: (values: Registration) => void;
}

export const RegistrationFormActions: FC<RegistrationFormActionsProps> = ({
  tabNumber,
  setTabNumber,
  handleSetRegistration,
}) => {
  const { t } = useTranslation('registration');
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector((store: RootStore) => store.user);
  const { values, errors, setTouched, dirty, isValid } = useFormikContext<Registration>();
  const { status, doiRequest } = values;

  const [openSupportModal, setOpenSupportModal] = useState(false);
  const toggleSupportModal = () => setOpenSupportModal((state) => !state);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingDoi, setIsUpdatingDoi] = useState<DoiRequestStatus | ''>('');
  const [isPublishing, setIsPublishing] = useState(false);

  const saveRegistration = async (values: Registration) => {
    setIsSaving(true);
    const updatedRegistration = await updateRegistration(values);
    if (updatedRegistration?.error) {
      dispatch(setNotification(updatedRegistration.error, NotificationVariant.Error));
    } else {
      handleSetRegistration(deepmerge(emptyRegistration, updatedRegistration));
      dispatch(setNotification(t('feedback:success.update_registration')));
    }
    setIsSaving(false);
    return !updatedRegistration.error;
  };

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

  const onClickUpdateDoiRequest = async (status: DoiRequestStatus) => {
    setIsUpdatingDoi(status);
    const updateDoiResponse = await updateDoiRequest(values.identifier, status);
    if (updateDoiResponse) {
      if (updateDoiResponse.error) {
        dispatch(setNotification(t('feedback:error.update_doi_request'), NotificationVariant.Error));
      } else {
        const updatedRegistration = await getRegistration(values.identifier);
        handleSetRegistration(updatedRegistration);
        dispatch(setNotification(t('feedback:success.doi_request_updated'), NotificationVariant.Success));
      }
    }
    setIsUpdatingDoi('');
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
            </Button>
          )}
        </div>
        <div>
          {/* Right aligned buttons */}
          <Button data-testid="open-support-button" variant="text" color="primary" onClick={toggleSupportModal}>
            {t('common:support')}
          </Button>
          {tabNumber !== RegistrationTab.FilesAndLicenses ? (
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
                {status === RegistrationStatus.DRAFT ? t('save_draft') : t('common:save')}
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
              </Button>
            </>
          ) : (
            <>
              <ButtonWithProgress
                variant={'outlined'}
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

              {user.isCurator && doiRequest?.status === DoiRequestStatus.Requested && (
                <>
                  <ButtonWithProgress
                    color="primary"
                    variant="contained"
                    data-testid="button-reject-doi"
                    endIcon={<CloseIcon />}
                    onClick={() => onClickUpdateDoiRequest(DoiRequestStatus.Rejected)}
                    isLoading={isUpdatingDoi === DoiRequestStatus.Rejected}
                    disabled={!!isUpdatingDoi || isSaving || !isValid}>
                    {t('common:reject_doi')}
                  </ButtonWithProgress>
                  <ButtonWithProgress
                    color="primary"
                    variant="contained"
                    data-testid="button-create-doi"
                    endIcon={<CheckIcon />}
                    onClick={() => onClickUpdateDoiRequest(DoiRequestStatus.Approved)}
                    isLoading={isUpdatingDoi === DoiRequestStatus.Approved}
                    disabled={!!isUpdatingDoi || isSaving || !isValid}>
                    {t('common:create_doi')}
                  </ButtonWithProgress>
                </>
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
