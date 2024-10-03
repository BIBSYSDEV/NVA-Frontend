import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Divider, IconButton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { RepublishRegistration } from './RepublishRegistration';
import { TerminateRegistration } from './TerminateRegistration';
import { UnpublishRegistration } from './UnpublishRegistration';

interface MoreActionsCollapseProps {
  registration: Registration;
}

export const MoreActionsCollapse = ({ registration }: MoreActionsCollapseProps) => {
  const { t } = useTranslation();
  const [openMoreActions, setOpenMoreActions] = useState(false);

  const isPublished = registration.status === 'PUBLISHED' || registration.status === 'PUBLISHED_METADATA';
  const isUnpublished = registration.status === 'UNPUBLISHED';

  if (!(isPublished || isUnpublished)) {
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
              <RepublishRegistration registration={registration} />
              <TerminateRegistration registration={registration} />
            </>
          )}
        </Box>
      )}
    </Box>
  );
};
