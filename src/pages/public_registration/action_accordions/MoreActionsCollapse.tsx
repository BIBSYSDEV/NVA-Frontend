import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Divider, IconButton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { isDegree, userHasAccessRight } from '../../../utils/registration-helpers';
import { DeleteDraftRegistration } from './DeleteDraftRegistration';
import { RepublishRegistration, RepublishRegistrationProps } from './RepublishRegistration';
import { TerminateRegistration } from './TerminateRegistration';
import { UnpublishRegistration } from './UnpublishRegistration';
import { UpdateTicketOwnership } from './UpdateTicketOwnership';

interface MoreActionsCollapseProps extends RepublishRegistrationProps {
  ticket?: PublishingTicket;
}

export const MoreActionsCollapse = ({ registration, registrationIsValid, ticket }: MoreActionsCollapseProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [openMoreActions, setOpenMoreActions] = useState(false);

  const isPublished = registration.status === 'PUBLISHED' || registration.status === 'PUBLISHED_METADATA';
  const isUnpublished = registration.status === 'UNPUBLISHED';
  const canDeleteRegistration = userHasAccessRight(registration, 'delete');
  const canChangeTicketOwnership =
    (ticket?.status === 'New' || ticket?.status === 'Pending') &&
    ticket.availableInstitutions &&
    ticket.availableInstitutions.length > 0 &&
    ((!isDegree(registration.entityDescription?.reference?.publicationInstance?.type) && user?.isPublishingCurator) ||
      (isDegree(registration.entityDescription?.reference?.publicationInstance?.type) && user?.isThesisCurator));

  if (!(isPublished || isUnpublished || canDeleteRegistration || canChangeTicketOwnership)) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
      <Divider flexItem />
      <IconButton
        sx={{ width: 'fit-content', alignSelf: 'center' }}
        size="small"
        data-testid={dataTestId.registrationLandingPage.tasksPanel.morePublishingActionsButton}
        title={openMoreActions ? t('common.show_fewer_options') : t('common.show_more_options')}
        onClick={() => setOpenMoreActions(!openMoreActions)}>
        {openMoreActions ? <ExpandLess /> : <ExpandMore />}
      </IconButton>

      {openMoreActions && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isPublished && <UnpublishRegistration registration={registration} />}
          {isUnpublished && (
            <>
              <RepublishRegistration registration={registration} registrationIsValid={registrationIsValid} />
              <TerminateRegistration registration={registration} />
            </>
          )}
          {canDeleteRegistration && <DeleteDraftRegistration registration={registration} />}
          {canChangeTicketOwnership && <UpdateTicketOwnership ticket={ticket} />}
        </Box>
      )}
    </Box>
  );
};
