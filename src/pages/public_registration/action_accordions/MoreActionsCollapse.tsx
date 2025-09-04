import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Divider, IconButton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BetaFunctionality } from '../../../components/BetaFunctionality';
import { RootState } from '../../../redux/store';
import { PublishingTicket } from '../../../types/publication_types/ticket.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userHasAccessRight } from '../../../utils/registration-helpers';
import { hasCuratorRole } from '../../../utils/user-helpers';
import { DeleteDraftRegistration } from './DeleteDraftRegistration';
import { MergeRegistrations } from './merge_registrations/MergeRegistrations';
import { RepublishRegistration, RepublishRegistrationProps } from './RepublishRegistration';
import { TerminateRegistration } from './TerminateRegistration';
import { UnpublishRegistration } from './UnpublishRegistration';
import { UpdateTicketOwnership } from './UpdateTicketOwnership';

interface MoreActionsCollapseProps extends RepublishRegistrationProps {
  ticket?: PublishingTicket;
  refetchData: () => Promise<void>;
}

export const MoreActionsCollapse = ({
  registration,
  registrationIsValid,
  ticket,
  refetchData,
}: MoreActionsCollapseProps) => {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user);
  const [openMoreActions, setOpenMoreActions] = useState(false);

  const isPublished = registration.status === 'PUBLISHED' || registration.status === 'PUBLISHED_METADATA';
  const isUnpublished = registration.status === 'UNPUBLISHED';
  const canDeleteRegistration = userHasAccessRight(registration, 'delete');
  const canChangeTicketOwnership = ticket && ticket.allowedOperations.includes('transfer');

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
          {isPublished && <UnpublishRegistration registration={registration} refetchData={refetchData} />}
          {isUnpublished && (
            <>
              <RepublishRegistration
                registration={registration}
                registrationIsValid={registrationIsValid}
                refetchData={refetchData}
              />
              <TerminateRegistration registration={registration} />
              {hasCuratorRole(user) && (
                <BetaFunctionality>
                  <MergeRegistrations sourceRegistration={registration} />
                </BetaFunctionality>
              )}
            </>
          )}
          {canDeleteRegistration && <DeleteDraftRegistration registration={registration} />}
          {canChangeTicketOwnership && <UpdateTicketOwnership ticket={ticket} refetchData={refetchData} />}
        </Box>
      )}
    </Box>
  );
};
