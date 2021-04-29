import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, DialogActions, TextField, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { useTranslation } from 'react-i18next';
import { validateYupSchema, yupToFormErrors } from 'formik';

import { RootStore } from '../../redux/reducers/rootReducer';
import { PublicRegistrationProps } from './PublicRegistrationContent';
import Modal from '../../components/Modal';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { RegistrationStatus, DoiRequestStatus, Registration } from '../../types/registration.types';
import { createDoiRequest, publishRegistration, updateDoiRequest } from '../../api/registrationApi';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { getRegistrationPath } from '../../utils/urlPaths';
import { getFirstErrorTab, getTabErrors, TabErrors } from '../../utils/formik-helpers';
import { ErrorList } from '../registration/ErrorList';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';

const StyledBackgroundDiv = styled(BackgroundDiv)`
  margin-bottom: 2rem;
`;

const StyledButtonsContainer = styled.div`
  display: flex;

  button,
  a {
    :not(:first-child) {
      margin-left: 1rem;
    }
  }
`;

enum LoadingName {
  None = '',
  Publish = 'PUBLISH',
  RequestDoi = 'REQUEST_DOI',
  RejectDoi = 'REJECT_DOI',
  ApproveDoi = 'APPROVE_DOI',
}

export const PublicRegistrationStatusBar = ({ registration, refetchRegistration }: PublicRegistrationProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootStore) => store.user);
  const { identifier, owner, status, doi, doiRequest, publisher } = registration;

  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(LoadingName.None);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((state) => !state);
  const [tabErrors, setTabErrors] = useState<TabErrors>();

  const sendDoiRequest = async () => {
    setIsLoading(LoadingName.RequestDoi);
    const createDoiRequestResponse = await createDoiRequest(identifier, messageToCurator);
    if (createDoiRequestResponse) {
      if (createDoiRequestResponse.error) {
        dispatch(setNotification(t('feedback:error.create_doi_request'), NotificationVariant.Error));
        setIsLoading(LoadingName.None);
      } else {
        // Adding DOI can take some extra time, so wait 2.5 sec before refetching
        setTimeout(() => {
          if (openRequestDoiModal) {
            toggleRequestDoiModal();
          }
          dispatch(setNotification(t('feedback:success.doi_request_sent')));
          refetchRegistration();
        }, 2500);
      }
    }
  };

  const onClickUpdateDoiRequest = async (status: DoiRequestStatus) => {
    if (status === DoiRequestStatus.Approved) {
      setIsLoading(LoadingName.ApproveDoi);
    } else {
      setIsLoading(LoadingName.RejectDoi);
    }
    const updateDoiResponse = await updateDoiRequest(identifier, status);
    if (updateDoiResponse) {
      if (updateDoiResponse.error) {
        dispatch(setNotification(t('feedback:error.update_doi_request'), NotificationVariant.Error));
        setIsLoading(LoadingName.None);
      } else {
        dispatch(setNotification(t('feedback:success.doi_request_updated'), NotificationVariant.Success));
        refetchRegistration();
      }
    }
  };

  const onClickPublish = async () => {
    setIsLoading(LoadingName.Publish);
    const publishedRegistration = await publishRegistration(identifier);
    if (publishedRegistration) {
      if (publishedRegistration.error) {
        dispatch(setNotification(t('feedback:error.publish_registration'), NotificationVariant.Error));
        setIsLoading(LoadingName.None);
      } else {
        dispatch(setNotification(t('feedback:success.published_registration'), NotificationVariant.Success));
        refetchRegistration();
      }
    }
  };

  useEffect(() => {
    try {
      validateYupSchema<Registration>(registration, registrationValidationSchema, true, {
        publicationContextType: registration.entityDescription.reference.publicationContext.type,
        publicationInstanceType: registration.entityDescription.reference.publicationInstance.type,
        publicationStatus: registration.status,
      });
    } catch (error) {
      const formErrors = yupToFormErrors(error);
      const customErrors = getTabErrors(registration, formErrors);
      setTabErrors(customErrors);
    }
  }, [registration]);

  const firstErrorTab = getFirstErrorTab(tabErrors);
  const registrationIsValid = !tabErrors || firstErrorTab === -1;

  const isOwner = user && user.isCreator && owner === user.id;
  const isCurator = user && user.isCurator && user.customerId === publisher.id;
  const hasNvaDoi = !!doi || doiRequest;
  const isPublishedRegistration = status === RegistrationStatus.PUBLISHED;
  const editRegistrationUrl = getRegistrationPath(identifier);

  return isOwner || isCurator ? (
    <>
      {!registrationIsValid && tabErrors && (
        <ErrorList
          tabErrors={tabErrors}
          description={
            <>
              <Typography variant="h4" component="h1">
                {registration.status === RegistrationStatus.PUBLISHED
                  ? t('public_page.published')
                  : t('public_page.not_published')}
              </Typography>
              <Typography>{t('public_page.error_description')}</Typography>
            </>
          }
          actions={
            <Button
              variant="contained"
              href={`${editRegistrationUrl}?tab=${firstErrorTab}`}
              endIcon={<EditIcon />}
              data-testid="back-to-wizard-button">
              {t('public_page.go_back_to_wizard')}
            </Button>
          }
        />
      )}
      <StyledBackgroundDiv
        backgroundColor={lightTheme.palette.background.statusBar}
        data-testid="public-registration-status">
        {!isPublishedRegistration && registrationIsValid && (
          <>
            <Typography variant="h4" component="h1">
              {t('public_page.ready_to_be_published')}
            </Typography>
            <Typography gutterBottom>{t('public_page.ready_to_be_published_description')}</Typography>
          </>
        )}
        {isPublishedRegistration && (
          <Typography variant="h4" component="h1" gutterBottom>
            {t('public_page.published_date', {
              date: registration.publishedDate ? new Date(registration.publishedDate).toLocaleDateString() : '',
            })}
          </Typography>
        )}
        <StyledButtonsContainer>
          {status === RegistrationStatus.DRAFT && (
            <ButtonWithProgress
              disabled={!!isLoading || !registrationIsValid}
              data-testid="button-publish-registration"
              color="secondary"
              endIcon={<CloudUploadIcon />}
              onClick={onClickPublish}
              isLoading={isLoading === LoadingName.Publish}>
              {t('common:publish')}
            </ButtonWithProgress>
          )}

          <Button
            href={editRegistrationUrl}
            variant="outlined"
            color="secondary"
            endIcon={<EditIcon />}
            data-testid="button-edit-registration">
            {t('edit_registration')}
          </Button>

          {!hasNvaDoi && (
            <ButtonWithProgress
              variant="outlined"
              color="secondary"
              endIcon={<LocalOfferIcon />}
              isLoading={isLoading === LoadingName.RequestDoi}
              data-testid="button-toggle-request-doi"
              onClick={() => (isPublishedRegistration ? toggleRequestDoiModal() : sendDoiRequest())}>
              {isPublishedRegistration ? t('public_page.request_doi') : t('public_page.reserve_doi')}
            </ButtonWithProgress>
          )}

          {isCurator && isPublishedRegistration && doiRequest?.status === DoiRequestStatus.Requested && (
            <>
              <ButtonWithProgress
                color="secondary"
                variant="contained"
                data-testid="button-reject-doi"
                endIcon={<CloseIcon />}
                onClick={() => onClickUpdateDoiRequest(DoiRequestStatus.Rejected)}
                isLoading={isLoading === LoadingName.RejectDoi}
                disabled={!!isLoading}>
                {t('common:reject_doi')}
              </ButtonWithProgress>
              <ButtonWithProgress
                color="secondary"
                variant="contained"
                data-testid="button-create-doi"
                endIcon={<CheckIcon />}
                onClick={() => onClickUpdateDoiRequest(DoiRequestStatus.Approved)}
                isLoading={isLoading === LoadingName.ApproveDoi}
                disabled={!!isLoading || !registrationIsValid}>
                {t('common:create_doi')}
              </ButtonWithProgress>
            </>
          )}
        </StyledButtonsContainer>

        {!hasNvaDoi && (
          <Modal
            open={openRequestDoiModal}
            onClose={toggleRequestDoiModal}
            headingText={t('public_page.request_doi')}
            dataTestId="request-doi-modal">
            <Typography>{t('public_page.request_doi_description')}</Typography>
            <TextField
              variant="outlined"
              multiline
              rows="4"
              fullWidth
              data-testid="request-doi-message"
              label={t('public_page.message_to_curator')}
              onChange={(event) => setMessageToCurator(event.target.value)}
            />
            <DialogActions>
              <Button onClick={toggleRequestDoiModal}>{t('common:cancel')}</Button>
              <ButtonWithProgress
                variant="contained"
                color="primary"
                data-testid="button-send-doi-request"
                onClick={sendDoiRequest}
                isLoading={isLoading === LoadingName.RequestDoi}>
                {t('common:send')}
              </ButtonWithProgress>
            </DialogActions>
          </Modal>
        )}
      </StyledBackgroundDiv>
    </>
  ) : null;
};
