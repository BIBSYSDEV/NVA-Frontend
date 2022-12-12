import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Tooltip, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@mui/icons-material/Warning';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { LoadingButton } from '@mui/lab';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFirstErrorTab, getTabErrors, TabErrors } from '../../../utils/formik-helpers';
import { getRegistrationWizardPath } from '../../../utils/urlPaths';
import { ErrorList } from '../../registration/ErrorList';
import { Ticket, TicketStatus } from '../../../types/publication_types/messages.types';
import { Registration, RegistrationStatus } from '../../../types/registration.types';
import { createTicket, updateTicketStatus } from '../../../api/registrationApi';
import { setNotification } from '../../../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { registrationValidationSchema } from '../../../utils/validation/registration/registrationValidation';
import { RootState } from '../../../redux/store';

interface PublishingAccordionProps {
  registration: Registration;
  refetchRegistrationAndTickets: () => void;
  publishingRequestTicket: Ticket | null;
  userIsCurator: boolean;
}

enum LoadingState {
  CreatePublishingREquest,
  ApprovePulishingRequest,
  RejectPublishingRequest,
  None,
}

export const PublishingAccordion = ({
  publishingRequestTicket,
  registration,
  refetchRegistrationAndTickets,
  userIsCurator,
}: PublishingAccordionProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const customer = useSelector((store: RootState) => store.customer);

  const [isLoading, setIsLoading] = useState(LoadingState.None);
  const [registrationIsValid, setRegistrationIsValid] = useState(false);

  const [tabErrors, setTabErrors] = useState<TabErrors>();
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
      setRegistrationIsValid(true);
    } catch (error) {
      const formErrors = yupToFormErrors(error);
      const customErrors = getTabErrors(registration, formErrors);
      setTabErrors(customErrors);
    }
  }, [registration]);

  const firstErrorTab = getFirstErrorTab(tabErrors);

  const onClickPublish = async () => {
    setIsLoading(LoadingState.CreatePublishingREquest);
    const createPublishingRequestTicketResponse = await createTicket(registration.id, 'PublishingRequest');
    if (isErrorStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.create_publishing_request'), variant: 'error' }));
      setIsLoading(LoadingState.None);
    } else if (isSuccessStatus(createPublishingRequestTicketResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.create_publishing_request'), variant: 'success' }));
      refetchRegistrationAndTickets();
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
        if (status === 'Completed') {
          dispatch(setNotification({ message: t('feedback.success.publishing_request_approved'), variant: 'success' }));
        } else {
          dispatch(setNotification({ message: t('feedback.success.publishing_request_rejected'), variant: 'success' }));
        }
        refetchRegistrationAndTickets();
      }
    }
  };

  const isPendingPublishingRequest = publishingRequestTicket?.status === 'Pending';

  return (
    <Accordion
      data-testid={dataTestId.registrationLandingPage.tasksPanel.publishingRequestAccordion}
      elevation={3}
      defaultExpanded={registration.status === RegistrationStatus.Draft}>
      <AccordionSummary sx={{ fontWeight: 700 }} expandIcon={<ExpandMoreIcon fontSize="large" />}>
        {t('registration.public_page.publishing_request')} - {t(`registration.status.${registration.status}`)}
        {!registrationIsValid && (
          <Tooltip title={t('registration.public_page.validation_errors')}>
            <WarningIcon color="warning" sx={{ ml: '0.5rem' }} />
          </Tooltip>
        )}
      </AccordionSummary>
      <AccordionDetails>
        {tabErrors && (
          <ErrorList
            tabErrors={tabErrors}
            description={<Typography>{t('registration.public_page.error_description')}</Typography>}
            actions={
              <Button
                variant="outlined"
                component={RouterLink}
                to={`${getRegistrationWizardPath(registration.identifier)}?tab=${firstErrorTab}`}
                endIcon={<EditIcon />}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.backToWizard}>
                {t('registration.public_page.go_back_to_wizard')}
              </Button>
            }
          />
        )}

        {isPendingPublishingRequest &&
          (customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles' ? (
            <>
              <Typography gutterBottom>
                Registreringen vil publiseres om kort tid. Last siden på nytt om litt for å se oppdatert info.
              </Typography>
              <Button variant="outlined" onClick={refetchRegistrationAndTickets} startIcon={<RefreshIcon />}>
                Last på nytt
              </Button>
            </>
          ) : customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' ? (
            <Typography paragraph>
              Metadata er synlig for andre brukere, men en kurator må godkjenne filene som er lastet opp før de blir
              synlige. Gå til Meldinger for å se oppdatert status.
            </Typography>
          ) : customer?.publicationWorkflow === 'RegistratorRequiresApprovalForMetadataAndFiles' ? (
            <Typography paragraph>
              En kurator må godkjenne innholdet før det publiseres og blir synlig for andre brukere.
            </Typography>
          ) : null)}

        {!isPendingPublishingRequest && registration.status === RegistrationStatus.Draft && registrationIsValid && (
          <>
            {customer?.publicationWorkflow === 'RegistratorPublishesMetadataAndFiles' ? (
              <Typography>
                Du kan publisere registreringen på egen hånd. Innholdet vil da bli synlig for andre brukere.
              </Typography>
            ) : customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly' ? (
              <Typography>
                Du kan publisere metadata selv, men en kurator må godkjenne filene som er lastet opp før de kan vises
                til andre brukere.
              </Typography>
            ) : customer?.publicationWorkflow === 'RegistratorRequiresApprovalForMetadataAndFiles' ? (
              <Typography>
                En kurator må godkjenne innholdet før det publiseres og blir synlig for andre brukere.
              </Typography>
            ) : null}
            <Typography>Se over utkast før du går videre.</Typography>
          </>
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
            {!isPendingPublishingRequest ? (
              <LoadingButton
                disabled={isLoading !== LoadingState.None || !registrationIsValid}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.publishButton}
                color="primary"
                variant="contained"
                endIcon={<CloudUploadIcon />}
                loadingPosition="end"
                onClick={onClickPublish}
                loading={isLoading === LoadingState.CreatePublishingREquest}>
                {customer?.publicationWorkflow === 'RegistratorRequiresApprovalForMetadataAndFiles'
                  ? 'Be om publisering'
                  : t('common.publish')}
              </LoadingButton>
            ) : (
              userIsCurator &&
              customer?.publicationWorkflow !== 'RegistratorPublishesMetadataAndFiles' && (
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
