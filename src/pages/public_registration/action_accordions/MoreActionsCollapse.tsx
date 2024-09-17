import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Box, Divider, IconButton } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Registration } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { userCanTerminateRegistration, userCanUnpublishRegistration } from '../../../utils/registration-helpers';
import { UnpublishRegistration } from './UnpublishRegistration';

interface MoreActionsCollapseProps {
  registration: Registration;
}

export const MoreActionsCollapse = ({ registration }: MoreActionsCollapseProps) => {
  const { t } = useTranslation();
  const [showMoreActions, setShowMoreActions] = useState(false);

  const userCanUnpublish = userCanUnpublishRegistration(registration);
  const userCanDelete = userCanTerminateRegistration(registration);

  if (!(userCanUnpublish || userCanDelete)) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
      <Divider flexItem />
      <IconButton
        sx={{ width: 'fit-content', alignSelf: 'center', p: '0' }}
        data-testid={dataTestId.unpublishActions.showUnpublishButtonButton} // TODO: Update data test id
        title={showMoreActions ? t('common.show_fewer_options') : t('common.show_more_options')}
        onClick={() => setShowMoreActions(!showMoreActions)}>
        {showMoreActions ? <ExpandLess /> : <ExpandMore />}
      </IconButton>

      {showMoreActions && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
          {userCanUnpublish ? <UnpublishRegistration registration={registration} /> : null}
        </Box>
      )}
    </Box>
  );
};
