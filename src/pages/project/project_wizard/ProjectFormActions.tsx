import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { CancelButton } from '../../../components/buttons/CancelButton';
import { DoubleNextButton } from '../../../components/buttons/DoubleNextButton';
import { NextButton } from '../../../components/buttons/NextButton';
import { PreviousButton } from '../../../components/buttons/PreviousButton';
import { StyledFormFooter } from '../../../components/styled/Wrappers';
import { ProjectTabs, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { hasErrors } from '../../../utils/formik-helpers/project-form-helpers';

interface ProjectFormActionsProps {
  tabNumber: number;
  onCancel: () => void;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickLast: () => void;
}

export const ProjectFormActions = ({
  tabNumber,
  onCancel,
  onClickNext,
  onClickPrevious,
  onClickLast,
}: ProjectFormActionsProps) => {
  const { t } = useTranslation();
  const { isSubmitting, errors, touched } = useFormikContext<SaveCristinProject>();
  const isFirstTab = tabNumber === ProjectTabs.Description;
  const isLastTab = tabNumber === ProjectTabs.Connections;
  const disable = hasErrors(errors, touched);

  return (
    <StyledFormFooter>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>{!isFirstTab && <PreviousButton onClick={onClickPrevious} />}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
        <CancelButton
          sx={{ mr: '1rem' }}
          testId={dataTestId.projectWizard.formActions.cancelEditProjectButton}
          onClick={onCancel}
        />
        {isLastTab && (
          <LoadingButton
            variant="contained"
            type="submit"
            sx={{ mr: '2rem' }}
            loading={isSubmitting}
            disabled={disable}
            data-testid={dataTestId.projectWizard.formActions.saveProjectButton}>
            {t('common.save_and_view')}
          </LoadingButton>
        )}
        {!isLastTab && (
          <>
            <NextButton onClick={onClickNext} />
            <DoubleNextButton onClick={onClickLast} />
          </>
        )}
      </Box>
    </StyledFormFooter>
  );
};
