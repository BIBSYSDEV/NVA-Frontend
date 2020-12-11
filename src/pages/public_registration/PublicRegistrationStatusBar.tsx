import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, DialogActions, TextField, Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import WorkOutlineIcon from '@material-ui/icons/WorkOutline';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { RootStore } from '../../redux/reducers/rootReducer';
import Card from '../../components/Card';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import Modal from '../../components/Modal';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import ButtonWithProgress from '../../components/ButtonWithProgress';
import { RegistrationStatus, DoiRequestStatus } from '../../types/registration.types';
import { createDoiRequest, updateDoiRequest } from '../../api/doiRequestApi';
import { publishRegistration } from '../../api/registrationApi';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';

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
  Doi = 'DOI',
  Publish = 'PUBLISH',
  RejectDoi = 'REJECT_DOI',
  ApproveDoi = 'APPROVE_DOI',
}

export const PublicRegistrationStatusBar: FC<PublicRegistrationContentProps> = ({
  registration,
  refetchRegistration,
}) => {
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
  const registrationIsValid = registrationValidationSchema.isValidSync(registration);

  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(LoadingName.None);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((state) => !state);

  const sendDoiRequest = async () => {
    setIsLoading(LoadingName.Doi);
    const createDoiRequestResponse = await createDoiRequest(identifier, messageToCurator);
    if (createDoiRequestResponse) {
      if (createDoiRequestResponse.error) {
        dispatch(setNotification(t('feedback:error.create_doi_request'), NotificationVariant.Error));
      } else {
        toggleRequestDoiModal();
        refetchRegistration();
        dispatch(setNotification(t('feedback:success.doi_request_sent')));
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
      } else {
        refetchRegistration();
        dispatch(setNotification(t('feedback:success.doi_request_updated'), NotificationVariant.Success));
      }
    }
  };

  const onClickPublish = async () => {
    setIsLoading(LoadingName.Publish);
    const publishedRegistration = await publishRegistration(identifier);
    if (publishedRegistration) {
      if (publishedRegistration.error) {
        dispatch(setNotification(t('feedback:error.publish_registration'), NotificationVariant.Error));
      } else {
        refetchRegistration();
        dispatch(setNotification(t('feedback:success.published_registration'), NotificationVariant.Success));
      }
    }
  };

  const isOwner = user && user.isCreator && owner === user.id;
  const isCurator = user && user.isCurator && user.customerId === publisher.id;
  const hasNvaDoi = !!doi;

  return isOwner || isCurator ? (
    <StyledStatusBar>
      <StyledStatusBarDescription>
        {status === RegistrationStatus.PUBLISHED ? (
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
        <Link to={`/registration/${identifier}`}>
          <Button
            variant={registrationIsValid ? 'outlined' : 'contained'}
            color="primary"
            data-testid="button-edit-registration">
            {t('edit_registration')}
          </Button>
        </Link>

        {!hasNvaDoi &&
          (doiRequest?.status === DoiRequestStatus.Requested ? (
            user.isCurator ? (
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
            ) : (
              <Button variant="contained" color="primary" disabled>
                {t('public_page.requested_doi')}
              </Button>
            )
          ) : (
            <>
              {status === RegistrationStatus.PUBLISHED && (
                <Button
                  variant={reference.doi ? 'outlined' : 'contained'}
                  color="primary"
                  data-testid="button-toggle-request-doi"
                  onClick={toggleRequestDoiModal}>
                  {t('public_page.request_doi')}
                </Button>
              )}
              {status === RegistrationStatus.DRAFT && (
                <Button variant="contained" color="primary" disabled>
                  {t('public_page.reserve_doi')}
                </Button>
              )}
            </>
          ))}

        {status === RegistrationStatus.DRAFT && (
          <ButtonWithProgress
            disabled={!!isLoading || !registrationIsValid}
            data-testid="button-publish-registration"
            endIcon={<CloudUploadIcon />}
            onClick={onClickPublish}
            isLoading={isLoading === LoadingName.Publish}>
            {t('common:publish')}
          </ButtonWithProgress>
        )}
      </div>

      {!hasNvaDoi && (
        <Modal open={openRequestDoiModal} onClose={toggleRequestDoiModal} headingText={t('public_page.request_doi')}>
          <Typography>{t('public_page.request_doi_description')}</Typography>
          <TextField
            variant="outlined"
            multiline
            rows="4"
            fullWidth
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
              isLoading={isLoading === LoadingName.Doi}>
              {t('common:send')}
            </ButtonWithProgress>
          </DialogActions>
        </Modal>
      )}
    </StyledStatusBar>
  ) : null;
};
