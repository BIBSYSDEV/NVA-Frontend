import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CancelButton } from '../../../components/buttons/CancelButton';
import { DoubleNextButton } from '../../../components/buttons/DoubleNextButton';
import { NextButton } from '../../../components/buttons/NextButton';
import { PreviousButton } from '../../../components/buttons/PreviousButton';
import { SaveButton } from '../../../components/buttons/SaveButton';
import { StyledFooter } from '../../../components/styled/Wrappers';
import { ProjectTabs } from '../../../types/project.types';
import { RegistrationTab } from '../../../types/registration.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface ProjectFormActionsProps {
  tabNumber: number;
  setTabNumber: (val: number) => void;
}

export const ProjectFormActions = ({ tabNumber, setTabNumber }: ProjectFormActionsProps) => {
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
          onClick={() => console.log('click cancel')}
        />
        <SaveButton
          sx={{ mr: '2rem' }}
          loading={false}
          onClick={() => console.log('on click save')}
          testId={dataTestId.projectWizard.formActions.saveProjectButton}
          text={isLastTab ? t('common.save_and_view') : t('common.save')}
        />
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
