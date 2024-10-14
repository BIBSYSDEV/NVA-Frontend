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
import { CristinProject, ProjectTabs } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { hasErrors } from '../../../utils/formik-helpers/project-form-helpers';

interface ProjectFormActionsProps {
  tabNumber: number;
  onCancel: () => void;
  onClickNext: () => void;
  onClickPrevious: () => void;
  onClickLast: () => void;
  openedInModal?: boolean;
}

export const ProjectFormActions = ({
  tabNumber,
  onCancel,
  onClickNext,
  onClickPrevious,
  onClickLast,
  openedInModal = false,
}: ProjectFormActionsProps) => {
  const { t } = useTranslation();
  const { values, isSubmitting, errors, touched } = useFormikContext<CristinProject>();
  const [openCancelConfirmView, setOpenCancelConfirmView] = useState(false);
  const isFirstTab = tabNumber === ProjectTabs.Description;
  const isLastTab = tabNumber === ProjectTabs.Connections;
  const disable = hasErrors(values, errors, touched);

  return (
    <StyledFormFooter>
      <Box sx={{ display: 'flex', flexGrow: '1' }}>{!isFirstTab && <PreviousButton onClick={onClickPrevious} />}</Box>
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
            {openedInModal ? t('project.save_and_close') : t('common.save_and_view')}
          </LoadingButton>
        )}
        {!isLastTab && (
          <>
            <NextButton onClick={onClickNext} />
            <DoubleNextButton onClick={onClickLast} />
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
