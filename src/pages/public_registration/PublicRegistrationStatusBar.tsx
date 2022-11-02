import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import { RootState } from '../../redux/store';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { setNotification } from '../../redux/notificationSlice';
import { RegistrationStatus } from '../../types/registration.types';
import { createTicket, updateTicketStatus } from '../../api/registrationApi';
import { getFirstErrorTab, TabErrors } from '../../utils/formik-helpers';
import { dataTestId } from '../../utils/dataTestIds';
import { isErrorStatus, isSuccessStatus } from '../../utils/constants';
import { userIsCuratorForRegistration, userIsRegistrationCurator } from '../../utils/registration-helpers';
import { useFetch } from '../../utils/hooks/useFetch';
import { TicketCollection, TicketStatus } from '../../types/publication_types/messages.types';
import { BackgroundDiv } from '../../components/styled/Wrappers';

enum LoadingState {
  None,
  Publish,
  RejectDoi,
  ApproveDoi,
  ApprovePublishRequest,
  RejectPublishRequest,
}

interface PublicRegistrationStatusBarProps extends PublicRegistrationContentProps {
  refetchRegistration: () => void;
}

export const PublicRegistrationStatusBar = ({
  registration,
  refetchRegistration,
}: PublicRegistrationStatusBarProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [tabErrors, setTabErrors] = useState<TabErrors>();

  const [registrationTicketCollection, isLoadingRegistrationTicketCollection] = useFetch<TicketCollection>({
    url: userIsCuratorForRegistration(user, registration) ? `${registration.id}/tickets` : '',
    withAuthentication: true,
    errorMessage: t('feedback.error.get_tickets'),
  });
  const registrationTickets = registrationTicketCollection?.tickets ?? [];

  const pendingPublishingRequestTicket = registrationTickets.find(
    (ticket) => ticket.type === 'PublishingRequest' && ticket.status === 'Pending'
  );

  const updatePendingPublishingRequest = async (status: TicketStatus) => {
    if (pendingPublishingRequestTicket) {
      if (status === 'Completed') {
        setIsLoading(LoadingState.ApprovePublishRequest);
      } else {
        setIsLoading(LoadingState.RejectPublishRequest);
      }

      const updateTicketStatusResponse = await updateTicketStatus(
        pendingPublishingRequestTicket.id,
        'PublishingRequest',
        status
      );
      if (isErrorStatus(updateTicketStatusResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_publishing_request'), variant: 'error' }));
        setIsLoading(LoadingState.None);
      } else if (isSuccessStatus(updateTicketStatusResponse.status)) {
        // TODO: Updating status of PublishingRequest can take some time, so wait 10 sec before refetching
        setTimeout(() => {
          if (status === 'Completed') {
            dispatch(
              setNotification({ message: t('feedback.success.publishing_request_approved'), variant: 'success' })
            );
          } else {
            dispatch(
              setNotification({ message: t('feedback.success.publishing_request_rejected'), variant: 'success' })
            );
          }
          refetchRegistration();
        }, 10_000);
      }
    }
  };

  const onClickPublish = async () => {
    setIsLoading(LoadingState.Publish);
    const createPublishingRequestTicketResponse = await createTicket(registration.id, 'PublishingRequest');
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_publishing_request'), variant: 'error' }));
      setIsLoading(LoadingState.None);
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      // TODO: Creating PublishingRequest can take some time, so wait 10 sec before refetching
      setTimeout(() => {
        dispatch(setNotification({ message: t('feedback.success.create_publishing_request'), variant: 'success' }));
        refetchRegistration();
      }, 10_000);
    }
  };

  const firstErrorTab = getFirstErrorTab(tabErrors);
  const registrationIsValid = !tabErrors || firstErrorTab === -1;

  const isCurator = userIsRegistrationCurator(user, registration);
  const isPublishedRegistration = registration.status === RegistrationStatus.Published;

  return (
    <div>
      <BackgroundDiv data-testid={dataTestId.registrationLandingPage.status}>
        {!isPublishedRegistration && registrationIsValid && (
          <>
            <Typography variant="h4" component="h1">
              {t('registration.public_page.ready_to_be_published')}
            </Typography>
            <Typography gutterBottom>{t('registration.public_page.ready_to_be_published_description')}</Typography>
          </>
        )}
        {isPublishedRegistration && (
          <Typography variant="h4" component="h1" gutterBottom>
            {t('registration.public_page.published_date', {
              date: registration.publishedDate ? new Date(registration.publishedDate).toLocaleDateString() : '',
              interpolation: { escapeValue: false },
            })}
          </Typography>
        )}
        <Box sx={{ display: 'flex', gap: '1rem' }}>
          {registration.status === RegistrationStatus.Draft &&
            !isLoadingRegistrationTicketCollection &&
            !pendingPublishingRequestTicket && (
              <LoadingButton
                disabled={!!isLoading || !registrationIsValid}
                data-testid={dataTestId.registrationLandingPage.publishButton}
                color="secondary"
                variant="contained"
                endIcon={<CloudUploadIcon />}
                loadingPosition="end"
                onClick={onClickPublish}
                loading={isLoading === LoadingState.Publish}>
                {t('common.publish')}
              </LoadingButton>
            )}

          {isCurator ? (
            isLoadingRegistrationTicketCollection ? (
              <CircularProgress />
            ) : (
              <>
                {!isPublishedRegistration && pendingPublishingRequestTicket && (
                  <>
                    <LoadingButton
                      variant="contained"
                      data-testid={dataTestId.registrationLandingPage.publishingRequestAcceptButton}
                      endIcon={<CheckIcon />}
                      loadingPosition="end"
                      onClick={() => updatePendingPublishingRequest('Completed')}
                      loading={isLoading === LoadingState.ApprovePublishRequest}
                      disabled={!!isLoading || !registrationIsValid}>
                      {t('registration.public_page.approve_publish_request')}
                    </LoadingButton>
                    <LoadingButton
                      variant="contained"
                      data-testid={dataTestId.registrationLandingPage.publishingRequestRejectButton}
                      endIcon={<CloseIcon />}
                      loadingPosition="end"
                      onClick={() => updatePendingPublishingRequest('Closed')}
                      loading={isLoading === LoadingState.RejectPublishRequest}
                      disabled={!!isLoading}>
                      {t('registration.public_page.reject_publish_request')}
                    </LoadingButton>
                  </>
                )}
              </>
            )
          ) : null}
        </Box>
      </BackgroundDiv>
    </div>
  );
};
