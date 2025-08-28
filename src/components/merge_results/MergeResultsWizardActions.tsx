import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { navigationButtonStyling } from '../../pages/registration/RegistrationFormActions';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { isOnImportPage } from '../../utils/urlPaths';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

export const MergeResultsWizardActions = () => {
  const { t } = useTranslation();
  const { formState } = useFormContext<Registration>();
  const { activeTab, setActiveTab } = useContext(MergeResultsWizardContext);

  return (
    <Box sx={{ gridColumn: '1/-1', display: 'flex', gap: '1rem', alignItems: 'center' }}>
      {activeTab !== RegistrationTab.Description && (
        <Tooltip title={t('common.previous')}>
          <IconButton
            onClick={() => setActiveTab(activeTab - 1)}
            data-testid={dataTestId.registrationWizard.formActions.previousTabButton}>
            <KeyboardArrowLeftIcon sx={navigationButtonStyling} />
          </IconButton>
        </Tooltip>
      )}

      <Button
        type="submit"
        variant="contained"
        sx={{ ml: 'auto' }}
        loading={formState.isSubmitting}
        data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}>
        {isOnImportPage() ? t('basic_data.central_import.import') : t('merge_results')}
      </Button>

      {activeTab !== RegistrationTab.ResourceType && (
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
