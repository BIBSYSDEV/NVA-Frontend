import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { navigationButtonStyling } from '../../pages/registration/RegistrationFormActions';
import { RegistrationTab } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardActions = () => {
  const { t } = useTranslation();
  const { activeTab, setActiveTab } = useContext(MergeResultsWizardContext);

  return (
    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {activeTab !== RegistrationTab.Description && (
        <Tooltip title={t('common.previous')}>
          <IconButton
            onClick={() => setActiveTab(activeTab - 1)}
            data-testid={dataTestId.registrationWizard.formActions.previousTabButton}>
            <KeyboardArrowLeftIcon sx={navigationButtonStyling} />
          </IconButton>
        </Tooltip>
      )}

      <Button type="submit" variant="contained" sx={{ ml: 'auto' }}>
        {t('common.save')}
      </Button>

      {activeTab !== RegistrationTab.FilesAndLicenses && (
        <Tooltip title={t('common.next')}>
          <IconButton
            onClick={() => setActiveTab(activeTab + 1)}
            data-testid={dataTestId.registrationWizard.formActions.nextTabButton}>
            <KeyboardArrowRightIcon sx={navigationButtonStyling} />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
