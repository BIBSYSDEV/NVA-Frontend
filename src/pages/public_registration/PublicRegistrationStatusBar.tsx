import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, DialogActions, TextField, Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RootStore } from '../../redux/reducers/rootReducer';
import Card from '../../components/Card';
import { PublicRegistrationProps } from './PublicRegistrationContent';
import Modal from '../../components/Modal';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { RegistrationStatus, DoiRequestStatus, Registration, RegistrationTab } from '../../types/registration.types';
import { createDoiRequest, publishRegistration, updateDoiRequest } from '../../api/registrationApi';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { getRegistrationPath } from '../../utils/urlPaths';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { getErrorsAcrossTabs } from '../../utils/formik-helpers';
import { ErrorList } from '../registration/ErrorList';
import { TabErrors, validTabs } from '../../types/publication_types/error.types';

const StyledStatusBar = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-left: 0.5rem;
  }
`;

const StyledStatusBarDescription = styled.div`
  display: flex;
  align-items: center;
  svg {
    margin-right: 0.5rem;
  }
`;

const StyledPublishedStatusIcon = styled(CheckCircleOutlineIcon)`
  color: green;
`;

const StyledUnpublishedStatusIcon = styled(WorkOutlineIcon)`
  color: orange;
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
  const {
    identifier,
    owner,
    status,
    entityDescription: { reference },
    doi,
    doiRequest,
    publisher,
  } = registration;

  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(LoadingName.None);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((state) => !state);
  const [errors, setErrors] = useState<TabErrors>(validTabs);

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
    } catch (e) {
      const yupErrors = yupToFormErrors(e);
      const newErrors = getErrorsAcrossTabs(registration, yupErrors);
      setErrors(newErrors);
    }
  }, [registration]);

  const registrationIsValid =
    errors[RegistrationTab.Description].length === 0 ||
    errors[RegistrationTab.ResourceType].length === 0 ||
    errors[RegistrationTab.Contributors].length === 0 ||
    errors[RegistrationTab.FilesAndLicenses].length === 0;

  const isOwner = user && user.isCreator && owner === user.id;
  const isCurator = user && user.isCurator && user.customerId === publisher.id;
  const hasNvaDoi = !!doi || doiRequest;
  const isPublishedRegistration = status === RegistrationStatus.PUBLISHED;

  return isOwner || isCurator ? (
    <>
      <ErrorList errors={errors} />
      <StyledStatusBar data-testid="public-registration-status">
        <StyledStatusBarDescription>
          {isPublishedRegistration ? (
            <StyledPublishedStatusIcon fontSize="large" />
          ) : (
            <StyledUnpublishedStatusIcon fontSize="large" />
          )}
          <div>
            <Typography>
              {t('common:status')}: {t(`status.${status}`)}
            </Typography>
            {!registrationIsValid && <Typography>{t('public_page.current_validation_errors')}</Typography>}
          </div>
        </StyledStatusBarDescription>
        <div>
          <Link to={getRegistrationPath(identifier)}>
            <Button
              variant={registrationIsValid ? 'outlined' : 'contained'}
              color="primary"
              endIcon={<EditIcon />}
              data-testid="button-edit-registration">
              {t('edit_registration')}
            </Button>
          </Link>

          {isCurator && isPublishedRegistration && doiRequest?.status === DoiRequestStatus.Requested && (
            <>
              <ButtonWithProgress
                color="primary"
                variant="contained"
                data-testid="button-reject-doi"
                endIcon={<CloseIcon />}
                onClick={() => onClickUpdateDoiRequest(DoiRequestStatus.Rejected)}
                isLoading={isLoading === LoadingName.RejectDoi}
                disabled={!!isLoading}>
                {t('common:reject_doi')}
              </ButtonWithProgress>
              <ButtonWithProgress
                color="primary"
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

          {!hasNvaDoi && (
            <ButtonWithProgress
              variant={reference.doi || !isPublishedRegistration ? 'outlined' : 'contained'}
              color="primary"
              endIcon={<LocalOfferIcon />}
              isLoading={isLoading === LoadingName.RequestDoi}
              data-testid="button-toggle-request-doi"
              onClick={() => (isPublishedRegistration ? toggleRequestDoiModal() : sendDoiRequest())}>
              {isPublishedRegistration ? t('public_page.request_doi') : t('public_page.reserve_doi')}
            </ButtonWithProgress>
          )}

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
        </div>

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
      </StyledStatusBar>
    </>
  ) : null;
};
