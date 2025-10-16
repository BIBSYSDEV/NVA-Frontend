import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, Button, IconButton, SxProps, Tooltip } from '@mui/material';
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { navigationButtonStyling } from '../../pages/registration/RegistrationFormActions';
import { Registration, RegistrationTab } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { MergeResultsWizardContext } from './MergeResultsWizardContext';

const flexStyling: SxProps = {
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
  flexWrap: 'wrap',
};

export interface MergeResultsWizardActionsProps {
  onCancel: () => void;
}

export const MergeResultsWizardActions = ({ onCancel }: MergeResultsWizardActionsProps) => {
  const { t } = useTranslation();
  const { formState } = useFormContext<Registration>();
  const { activeTab, setActiveTab, sourceHeading } = useContext(MergeResultsWizardContext);

  return (
    <Box sx={{ ...flexStyling, gridColumn: '1/-1' }}>
      {activeTab !== RegistrationTab.Description && (
        <Tooltip title={t('common.previous')}>
          <IconButton
            onClick={() => setActiveTab(activeTab - 1)}
            data-testid={dataTestId.registrationWizard.formActions.previousTabButton}>
            <KeyboardArrowLeftIcon sx={navigationButtonStyling} />
          </IconButton>
        </Tooltip>
      )}

      <Box sx={{ ...flexStyling, ml: 'auto' }}>
        {onCancel && (
          <Button data-testid={dataTestId.registrationWizard.formActions.cancelEditButton} onClick={onCancel}>
            {t('common.cancel')}
          </Button>
        )}

        <Button
          type="submit"
          color="secondary"
          variant="contained"
          loading={formState.isSubmitting}
          data-testid={dataTestId.registrationWizard.formActions.saveRegistrationButton}>
          {sourceHeading}
        </Button>
      </Box>

      {activeTab !== RegistrationTab.Contributors && (
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
