import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CancelButton } from '../../../components/buttons/CancelButton';
import { DoubleNextButton } from '../../../components/buttons/DoubleNextButton';
import { NextButton } from '../../../components/buttons/NextButton';
import { PreviousButton } from '../../../components/buttons/PreviousButton';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { StyledFormFooter } from '../../../components/styled/Wrappers';
import { ProjectTabs, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { hasErrors } from '../../../utils/formik-helpers/project-form-helpers';

interface ProjectFormActionsProps {
  tabNumber: number;
  setTabNumber: (val: number) => void;
  onCancel: () => void;
}

export const ProjectFormActions = ({ tabNumber, setTabNumber, onCancel }: ProjectFormActionsProps) => {
  const { t } = useTranslation();
  const { isSubmitting, errors, touched } = useFormikContext<SaveCristinProject>();
  const [openCancelConfirmView, setOpenCancelConfirmView] = useState(false);
  const isFirstTab = tabNumber === ProjectTabs.Description;
  const isLastTab = tabNumber === ProjectTabs.Connections;
  const disable = hasErrors(errors, touched);

  const goToNextTab = () => setTabNumber(tabNumber + 1);
  const goToPreviousTab = () => setTabNumber(tabNumber - 1);
  const goToLastTab = () => setTabNumber(ProjectTabs.Connections);

  return (
    <StyledFormFooter>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>{!isFirstTab && <PreviousButton onClick={goToPreviousTab} />}</Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end' }}>
        <CancelButton
          sx={{ mr: '1rem' }}
          testId={dataTestId.projectWizard.formActions.cancelEditProjectButton}
          onClick={() => setOpenCancelConfirmView(true)}
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
            <NextButton onClick={goToNextTab} />
            <DoubleNextButton onClick={goToLastTab} />
          </>
        )}
      </Box>
      <ConfirmDialog
        open={openCancelConfirmView}
        title={t('project.close_view')}
        onAccept={() => {
          setOpenCancelConfirmView(false);
          onCancel();
        }}
        onCancel={() => setOpenCancelConfirmView(false)}>
        {t('project.close_view_description')}
      </ConfirmDialog>
    </StyledFormFooter>
  );
};
