import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Form, Formik, FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { CreateProjectStartPage } from './CreateProjectStartPage';
import { ProjectFormPanel2 } from './ProjectFormPanel2';
import { ProjectFormPanel1 } from './ProjectFormPanel1';

export enum ProjectFieldName {
  Title = 'title',
  CoordinatingInstitutionId = 'coordinatingInstitution.id',
  Contributors = 'contributors',
  StartDate = 'startDate',
  EndDate = 'endDate',
  AcademicSummary = 'academicSummary.no',
  PopularScientificSummary = 'popularScientificSummary.no',
  Keywords = 'keywords',
}

interface ProjectFormDialogProps extends Pick<DialogProps, 'open'> {
  onClose: () => void;
  currentProject?: CristinProject;
  refetchData?: () => void;
}

export const ProjectFormDialog = ({ currentProject, refetchData, onClose, open }: ProjectFormDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState<CristinProject | SaveCristinProject | undefined>(currentProject);
  const [selectedPanel, setSelectedPanel] = useState(0);
  const editMode = !!currentProject;

  const handleClose = () => {
    onClose();
    setInitialValues(currentProject);
    setSelectedPanel(0);
  };

  const submitProjectForm = async (values: SaveCristinProject) => {
    if (editMode) {
      const updateProjectResponse = await authenticatedApiRequest({
        url: currentProject.id,
        method: 'PATCH',
        data: values,
      });

      if (isSuccessStatus(updateProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.update_project'), variant: 'success' }));
        handleClose();
        refetchData?.();
      } else if (isErrorStatus(updateProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.update_project'), variant: 'error' }));
      }
    } else {
      const createProjectResponse = await authenticatedApiRequest({
        url: CristinApiPath.Project,
        method: 'POST',
        data: values,
      });

      if (isSuccessStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.create_project'), variant: 'success' }));
        handleClose();
      } else if (isErrorStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_project'), variant: 'error' }));
      }
    }
  };

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      onClose={handleClose}
      open={open}
      PaperProps={{ sx: { bgcolor: 'info.light' } }}
      transitionDuration={0}>
      <DialogTitle>{editMode ? t('project.edit_project') : t('project.create_project')}</DialogTitle>

      {!initialValues ? (
        <CreateProjectStartPage onClose={handleClose} setInitialValues={setInitialValues} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={basicProjectValidationSchema}
          onSubmit={submitProjectForm}>
          {({ isSubmitting }: FormikProps<SaveCristinProject>) => (
            <Form noValidate>
              <DialogContent>
                {selectedPanel === 0 ? <ProjectFormPanel1 currentProject={currentProject} /> : <ProjectFormPanel2 />}
              </DialogContent>

              <DialogActions sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                <RadioGroup row sx={{ gridArea: '1/2', justifyContent: 'center' }}>
                  <Radio checked={selectedPanel === 0} onClick={() => setSelectedPanel(0)} />
                  <Radio checked={selectedPanel === 1} onClick={() => setSelectedPanel(1)} />
                </RadioGroup>

                <Box sx={{ gridArea: '1/3', display: 'flex', gap: '0.5rem', justifyContent: 'end' }}>
                  <Button onClick={handleClose}>{t('common.cancel')}</Button>
                  {selectedPanel === 0 ? (
                    <Button variant="contained" onClick={() => setSelectedPanel(1)}>
                      {t('common.next')}
                    </Button>
                  ) : (
                    <LoadingButton variant="contained" loading={isSubmitting} type="submit">
                      {t('common.save')}
                    </LoadingButton>
                  )}
                </Box>
              </DialogActions>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
};
