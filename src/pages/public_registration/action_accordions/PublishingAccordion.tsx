import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFirstErrorTab, TabErrors } from '../../../utils/formik-helpers';
import { getRegistrationPath } from '../../../utils/urlPaths';
import { ErrorList } from '../../registration/ErrorList';
import { Ticket, TicketStatus } from '../../../types/publication_types/messages.types';
import { ActionPanelProps } from '../ActionPanel';
import { RegistrationStatus } from '../../../types/registration.types';
import { createTicket, updateTicketStatus } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { userIsRegistrationCurator } from '../../../utils/registration-helpers';
import { RootState } from '../../../redux/store';

interface PublishingAccordionProps extends ActionPanelProps {
  errors: TabErrors | undefined;
  publishingRequestTicket: Ticket | null;
}

enum LoadingState {
  CreatePublishingREquest,
  ApprovePulishingRequest,
  RejectPublishingRequest,
  None,
}

export const PublishingAccordion = ({
  errors,
  publishingRequestTicket,
  registration,
  refetchRegistration,
}: PublishingAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((store: RootState) => store.user);

  const firstErrorTab = getFirstErrorTab(errors);
  const registrationIsValid = firstErrorTab === -1;

  const [isLoading, setIsLoading] = useState(LoadingState.None);

  const onClickPublish = async () => {
    setIsLoading(LoadingState.CreatePublishingREquest);
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

  const updatePendingPublishingRequest = async (status: TicketStatus) => {
    if (publishingRequestTicket) {
      if (status === 'Completed') {
        setIsLoading(LoadingState.ApprovePulishingRequest);
      } else {
        setIsLoading(LoadingState.RejectPublishingRequest);
      }

      const updateTicketStatusResponse = await updateTicketStatus(
        publishingRequestTicket.id,
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

  const isCurator = userIsRegistrationCurator(user, registration);
  const hasPendingPublishingRequest = publishingRequestTicket?.status === 'Pending';

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAccordion}
      elevation={3}
      defaultExpanded={registration.status === RegistrationStatus.Draft}>
      <AccordionSummary expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('registration.public_page.publishing_request')} - {t(`registration.status.${registration.status}`)}
        {!registrationIsValid && (
          <Tooltip title={t('registration.public_page.validation_errors')}>
            <WarningIcon color="warning" sx={{ ml: '0.5rem' }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {errors && (
          <ErrorList
            tabErrors={errors}
            description={<Typography>{t('registration.public_page.error_description')}</Typography>}
            actions={
              <Button
                variant="outlined"
                component={RouterLink}
                to={`${getRegistrationPath(registration.identifier)}?tab=${firstErrorTab}`}
                endIcon={<EditIcon />}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.backToWizard}>
                {t('registration.public_page.go_back_to_wizard')}
              </Button>
            }
          />
        )}

        {registration.status === RegistrationStatus.Published && (
          <Typography>
            {t('registration.public_page.published_date', {
              date: registration.publishedDate ? new Date(registration.publishedDate).toLocaleDateString() : '',
              interpolation: { escapeValue: false },
            })}
          </Typography>
        )}
        {registration.status === RegistrationStatus.Draft && (
          <Box sx={{ mt: '1rem', display: 'flex', gap: '1rem' }}>
            {!hasPendingPublishingRequest ? (
              <LoadingButton
                disabled={isLoading !== LoadingState.None || !registrationIsValid}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.publishButton}
                color="secondary"
                variant="contained"
                endIcon={<CloudUploadIcon />}
                loadingPosition="end"
                onClick={onClickPublish}
                loading={isLoading === LoadingState.CreatePublishingREquest}>
                {t('common.publish')}
              </LoadingButton>
            ) : (
              isCurator && (
                <>
                  <LoadingButton
                    variant="contained"
                    data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAcceptButton}
                    endIcon={<CheckIcon />}
                    loadingPosition="end"
                    onClick={() => updatePendingPublishingRequest('Completed')}
                    loading={isLoading === LoadingState.ApprovePulishingRequest}
                    disabled={isLoading !== LoadingState.None || !registrationIsValid}>
                    {t('registration.public_page.approve_publish_request')}
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestRejectButton}
                    endIcon={<CloseIcon />}
                    loadingPosition="end"
                    onClick={() => updatePendingPublishingRequest('Closed')}
                    loading={isLoading === LoadingState.RejectPublishingRequest}
                    disabled={isLoading !== LoadingState.None}>
                    {t('registration.public_page.reject_publish_request')}
                  </LoadingButton>
                </>
              )
            )}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
