import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Box, Button, DialogActions, TextField, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useTranslation } from 'react-i18next';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { RootStore } from '../../redux/reducers/rootReducer';
import { PublicRegistrationProps } from './PublicRegistrationContent';
import { Modal } from '../../components/Modal';
import { setNotification } from '../../redux/actions/notificationActions';
import { NotificationVariant } from '../../types/notification.types';
import { RegistrationStatus, DoiRequestStatus, Registration } from '../../types/registration.types';
import { createDoiRequest, publishRegistration, updateDoiRequest } from '../../api/registrationApi';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { getRegistrationPath } from '../../utils/urlPaths';
import { getFirstErrorTab, getTabErrors, TabErrors } from '../../utils/formik-helpers';
import { ErrorList } from '../registration/ErrorList';
import { dataTestId } from '../../utils/dataTestIds';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';

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
  const { identifier, owner, doi, doiRequest, publisher } = registration;

  const [messageToCurator, setMessageToCurator] = useState('');
  const [openRequestDoiModal, setOpenRequestDoiModal] = useState(false);
  const [isLoading, setIsLoading] = useState(LoadingName.None);
  const toggleRequestDoiModal = () => setOpenRequestDoiModal((state) => !state);
  const [tabErrors, setTabErrors] = useState<TabErrors>();

  const sendDoiRequest = async () => {
    setIsLoading(LoadingName.RequestDoi);
    const createDoiRequestResponse = await createDoiRequest(identifier, messageToCurator);
    if (isErrorStatus(createDoiRequestResponse.status)) {
      dispatch(setNotification(t('feedback:error.create_doi_request'), NotificationVariant.Error));
      setIsLoading(LoadingName.None);
    } else if (isSuccessStatus(createDoiRequestResponse.status)) {
      // Adding DOI can take some extra time, so wait 2.5 sec before refetching
      setTimeout(() => {
        if (openRequestDoiModal) {
          toggleRequestDoiModal();
        }
        dispatch(setNotification(t('feedback:success.doi_request_sent')));
        refetchRegistration();
      }, 2500);
    }
  };

  const onClickUpdateDoiRequest = async (status: DoiRequestStatus) => {
    if (status === DoiRequestStatus.Approved) {
      setIsLoading(LoadingName.ApproveDoi);
    } else {
      setIsLoading(LoadingName.RejectDoi);
    }
    const updateDoiResponse = await updateDoiRequest(identifier, status);
    if (isErrorStatus(updateDoiResponse.status)) {
      dispatch(setNotification(t('feedback:error.update_doi_request'), NotificationVariant.Error));
      setIsLoading(LoadingName.None);
    } else if (isSuccessStatus(updateDoiResponse.status)) {
      dispatch(setNotification(t('feedback:success.doi_request_updated'), NotificationVariant.Success));
      refetchRegistration();
    }
  };

  const onClickPublish = async () => {
    setIsLoading(LoadingName.Publish);
    const publishRegistrationResponse = await publishRegistration(identifier);
    if (isErrorStatus(publishRegistrationResponse.status)) {
      dispatch(setNotification(t('feedback:error.publish_registration'), NotificationVariant.Error));
      setIsLoading(LoadingName.None);
    } else if (isSuccessStatus(publishRegistrationResponse.status)) {
      dispatch(setNotification(t('feedback:success.published_registration'), NotificationVariant.Success));
      refetchRegistration();
    }
  };

  useEffect(() => {
    const publicationInstance = registration.entityDescription?.reference?.publicationInstance;
    const contentType =
      publicationInstance && 'contentType' in publicationInstance ? publicationInstance.contentType : null;
    try {
      validateYupSchema<Registration>(registration, registrationValidationSchema, true, {
        publicationInstanceType: publicationInstance?.type ?? '',
        publicationStatus: registration.status,
        contentType,
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
  const isPublishedRegistration = registration.status === RegistrationStatus.Published;
  const editRegistrationUrl = getRegistrationPath(identifier);

  return isOwner || isCurator ? (
    <Box>
      {!registrationIsValid && tabErrors && (
        <ErrorList
          tabErrors={tabErrors}
          description={
            <>
              <Typography variant="h4" component="h1">
                {registration.status === RegistrationStatus.Published
                  ? t('public_page.published')
                  : t('public_page.not_published')}
              </Typography>
              <Typography>{t('public_page.error_description')}</Typography>
            </>
          }
          actions={
            <Button
              variant="contained"
              color="inherit"
              component={RouterLink}
              to={`${editRegistrationUrl}?tab=${firstErrorTab}`}
              endIcon={<EditIcon />}
              data-testid={dataTestId.registrationLandingPage.backToWizard}>
              {t('public_page.go_back_to_wizard')}
            </Button>
          }
        />
      )}
      <Box
        sx={{ bgcolor: 'background.paper', p: '1rem', mb: '1rem', borderBottom: '2px dotted' }}
        data-testid={dataTestId.registrationLandingPage.status}>
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
              interpolation: { escapeValue: false },
            })}
          </Typography>
        )}
        <StyledButtonsContainer>
          {registration.status === RegistrationStatus.Draft && (
            <LoadingButton
              disabled={!!isLoading || !registrationIsValid}
              data-testid={dataTestId.registrationLandingPage.publishButton}
              color="secondary"
              variant="contained"
              endIcon={<CloudUploadIcon />}
              loadingPosition="end"
              onClick={onClickPublish}
              loading={isLoading === LoadingName.Publish}>
              {t('common:publish')}
            </LoadingButton>
          )}

          <Button
            component={RouterLink}
            to={editRegistrationUrl}
            variant="outlined"
            color="secondary"
            endIcon={<EditIcon />}
            data-testid={dataTestId.registrationLandingPage.editButton}>
            {t('edit_registration')}
          </Button>

          {!hasNvaDoi && (
            <LoadingButton
              variant="outlined"
              color="secondary"
              endIcon={<LocalOfferIcon />}
              loadingPosition="end"
              loading={isLoading === LoadingName.RequestDoi}
              data-testid={
                isPublishedRegistration
                  ? dataTestId.registrationLandingPage.requestDoiButton
                  : dataTestId.registrationLandingPage.reserveDoiButton
              }
              onClick={() => (isPublishedRegistration ? toggleRequestDoiModal() : sendDoiRequest())}>
              {isPublishedRegistration ? t('public_page.request_doi') : t('public_page.reserve_doi')}
            </LoadingButton>
          )}

          {isCurator && isPublishedRegistration && doiRequest?.status === DoiRequestStatus.Requested && (
            <>
              <LoadingButton
                color="secondary"
                variant="contained"
                data-testid={dataTestId.registrationLandingPage.rejectDoiButton}
                endIcon={<CloseIcon />}
                loadingPosition="end"
                onClick={() => onClickUpdateDoiRequest(DoiRequestStatus.Rejected)}
                loading={isLoading === LoadingName.RejectDoi}
                disabled={!!isLoading}>
                {t('common:reject_doi')}
              </LoadingButton>
              <LoadingButton
                color="secondary"
                variant="contained"
                data-testid={dataTestId.registrationLandingPage.createDoiButton}
                endIcon={<CheckIcon />}
                loadingPosition="end"
                onClick={() => onClickUpdateDoiRequest(DoiRequestStatus.Approved)}
                loading={isLoading === LoadingName.ApproveDoi}
                disabled={!!isLoading || !registrationIsValid}>
                {t('common:create_doi')}
              </LoadingButton>
            </>
          )}
        </StyledButtonsContainer>

        {!hasNvaDoi && (
          <Modal
            open={openRequestDoiModal}
            onClose={toggleRequestDoiModal}
            headingText={t('public_page.request_doi')}
            dataTestId={dataTestId.registrationLandingPage.requestDoiModal}>
            <Typography paragraph>{t('public_page.request_doi_description')}</Typography>
            <TextField
              variant="outlined"
              multiline
              rows="4"
              fullWidth
              data-testid={dataTestId.registrationLandingPage.doiMessageField}
              label={t('public_page.message_to_curator')}
              onChange={(event) => setMessageToCurator(event.target.value)}
            />
            <DialogActions>
              <Button onClick={toggleRequestDoiModal}>{t('common:cancel')}</Button>
              <LoadingButton
                variant="contained"
                color="primary"
                data-testid={dataTestId.registrationLandingPage.sendDoiButton}
                onClick={sendDoiRequest}
                loading={isLoading === LoadingName.RequestDoi}>
                {t('common:send')}
              </LoadingButton>
            </DialogActions>
          </Modal>
        )}
      </Box>
    </Box>
  ) : null;
};
