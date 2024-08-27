import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CancelButton } from '../../../components/buttons/CancelButton';
import { DoubleNextButton } from '../../../components/buttons/DoubleNextButton';
import { NextButton } from '../../../components/buttons/NextButton';
import { PreviousButton } from '../../../components/buttons/PreviousButton';
import { StyledFooter } from '../../../components/styled/Wrappers';
import { ProjectTabs } from '../../../types/project.types';
import { RegistrationTab } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface ProjectFormActionsProps {
  tabNumber: number;
  setTabNumber: (val: number) => void;
  cancelEdit: () => void;
  isSaving: boolean;
  hasErrors: boolean;
}

export const ProjectFormActions = ({
  tabNumber,
  setTabNumber,
  isSaving,
  hasErrors,
  cancelEdit,
}: ProjectFormActionsProps) => {
  const { t } = useTranslation();
  const isFirstTab = tabNumber === RegistrationTab.Description;
  const isLastTab = tabNumber === RegistrationTab.FilesAndLicenses;

  const incrementByOne = () => setTabNumber(tabNumber + 1);
  const decrementByOne = () => setTabNumber(tabNumber - 1);
  const goToLast = () => setTabNumber(ProjectTabs.Connections);

  return (
    <StyledFooter>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>{!isFirstTab && <PreviousButton onClick={decrementByOne} />}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
        <CancelButton
          sx={{ mr: '1rem' }}
          testId={dataTestId.projectWizard.formActions.cancelEditProjectButton}
          onClick={cancelEdit}
        />
        <LoadingButton
          variant="contained"
          type="submit"
          sx={{ height: '2rem', mr: '2rem' }}
          loading={isSaving}
          disabled={hasErrors}
          data-testid={dataTestId.projectWizard.formActions.saveProjectButton}>
          {isLastTab ? t('common.save_and_view') : t('common.save')}
        </LoadingButton>
        {!isLastTab && (
          <>
            <NextButton onClick={incrementByOne} sx={{ mr: '-0.5rem' }} />
            <DoubleNextButton onClick={goToLast} />
          </>
        )}
      </Box>
    </StyledFooter>
  );
};
