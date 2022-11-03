import { CircularProgress, Paper, Typography } from '@mui/material';
import { validateYupSchema, yupToFormErrors } from 'formik';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { StyledPaperHeader } from '../../components/PageWithSideMenu';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { TicketCollection } from '../../types/publication_types/messages.types';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { TabErrors, getTabErrors } from '../../utils/formik-helpers';
import { useFetch } from '../../utils/hooks/useFetch';
import { userIsCuratorForRegistration } from '../../utils/registration-helpers';
import { registrationValidationSchema } from '../../utils/validation/registration/registrationValidation';
import { DoiRequestAccordion } from './action_accordions/DoiRequestAccordion';
import { PublishingAccordion } from './action_accordions/PublishingAccordion';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export interface ActionPanelProps extends PublicRegistrationContentProps {
  refetchRegistration: () => void;
}

export const ActionPanel = ({ registration, refetchRegistration }: ActionPanelProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

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
    } catch (error) {
      const formErrors = yupToFormErrors(error);
      const customErrors = getTabErrors(registration, formErrors);
      setTabErrors(customErrors);
    }
  }, [registration]);

  const [registrationTicketCollection, isLoadingRegistrationTicketCollection] = useFetch<TicketCollection>({
    url: userIsCuratorForRegistration(user, registration) ? `${registration.id}/tickets` : '',
    withAuthentication: true,
    errorMessage: t('feedback.error.get_tickets'),
  });
  const registrationTickets = registrationTicketCollection?.tickets ?? [];
  const doiRequestTicket = registrationTickets.find((ticket) => ticket.type === 'DoiRequest') ?? null;

  return (
    <Paper elevation={0} data-testid={dataTestId.registrationLandingPage.tasksPanel.panelRoot}>
      <StyledPaperHeader>
        <Typography color="inherit" variant="h2" component="h1" id="tasks-header">
          {t('common.tasks')}
        </Typography>
      </StyledPaperHeader>
      <BackgroundDiv>
        {isLoadingRegistrationTicketCollection ? (
          <CircularProgress aria-labelledby="tasks-header" />
        ) : (
          <>
            <PublishingAccordion
              refetchRegistration={refetchRegistration}
              registration={registration}
              errors={tabErrors}
              publishingRequestTicket={
                registrationTickets.find((ticket) => ticket.type === 'PublishingRequest') ?? null
              }
            />
            {!registration.entityDescription?.reference?.doi && doiRequestTicket?.status !== 'Completed' && (
              <DoiRequestAccordion
                refetchRegistration={refetchRegistration}
                registration={registration}
                doiRequestTicket={doiRequestTicket}
              />
            )}
          </>
        )}
      </BackgroundDiv>
    </Paper>
  );
};
