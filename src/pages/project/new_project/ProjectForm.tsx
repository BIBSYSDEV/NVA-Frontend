import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, DialogContent, Radio, RadioGroup, Typography } from '@mui/material';
import { Form, Formik, FormikProps, FormikTouched } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { useFetchProject } from '../../../api/hooks/useFetchProject';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { PageSpinner } from '../../../components/PageSpinner';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { Forbidden } from '../../errorpages/Forbidden';
import { ProjectFormPanel1 } from '../../projects/form/ProjectFormPanel1';
import { ProjectFormPanel2 } from '../../projects/form/ProjectFormPanel2';

interface ProjectFormDialogProps {
  onClose: () => void;
  identifier: string;
  onCreateProject?: (project: CristinProject) => void | Promise<unknown>;
  currentProject?: CristinProject;
  refetchData?: () => void;
}

type ProjectInitialValues = CristinProject | SaveCristinProject | undefined;

export interface InitialProjectFormData {
  project: ProjectInitialValues;
  suggestedProjectManager?: string;
}

const ProjectForm = ({ identifier, currentProject, refetchData, onClose, onCreateProject }: ProjectFormDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const projectQuery = useFetchProject(identifier);
  const project = projectQuery.data;
  const [initialValues, setInitialValues] = useState<InitialProjectFormData>({
    project: project,
  });

  const [showConfirmCloseDialog, setShowConfirmCloseDialog] = useState(false);
  const toggleShowConfirmCloseDialog = () => setShowConfirmCloseDialog(!showConfirmCloseDialog);
  const [selectedPanel, setSelectedPanel] = useState<0 | 1>(0);
  const canEditProject = true; // TODO access control

  const handleClose = () => {
    onClose();
    setInitialValues({ project: currentProject });
    setSelectedPanel(0);
    setShowConfirmCloseDialog(false);
  };

  const submitProjectForm = async (values: SaveCristinProject) => {
    const updateProjectResponse = await authenticatedApiRequest<CristinProject>({
      url: project!.id,
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
  };

  return projectQuery.isPending ? (
    <PageSpinner aria-label={t('common.result')} />
  ) : !canEditProject ? (
    <Forbidden />
  ) : projectQuery.data ? (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '1rem' }}>
      <ErrorBoundary>
        <Formik initialValues={project!} validationSchema={basicProjectValidationSchema} onSubmit={submitProjectForm}>
          {({ isSubmitting, errors, setTouched, touched, values }: FormikProps<CristinProject>) => {
            const errorOnTab1 =
              (errors.title && touched.title) ||
              (errors.contributors && touched.contributors) ||
              (errors.startDate && touched.startDate) ||
              (errors.endDate && touched.endDate) ||
              (errors.coordinatingInstitution && touched.coordinatingInstitution) ||
              (errors.funding && touched.funding);
            const errorOnTab2 = false;

            const touchFieldsOnPanel1: FormikTouched<SaveCristinProject> = {
              ...touched,
              title: true,
              startDate: true,
              endDate: true,
              coordinatingInstitution: {
                id: true,
              },
              contributors: values.contributors.map(() => ({
                type: true,
                identity: { id: true },
                affiliation: { id: true },
              })),
              funding: values.funding.map(() => ({
                source: true,
                identifier: true,
              })),
            };

            const goToNextTab = () => {
              setTouched(touchFieldsOnPanel1);
              setSelectedPanel(1);
            };

            return (
              <Form noValidate>
                <DialogContent>
                  <ErrorBoundary>
                    {selectedPanel === 0 ? (
                      <ProjectFormPanel1
                        currentProject={currentProject}
                        suggestedProjectManager={initialValues.suggestedProjectManager}
                      />
                    ) : (
                      <ProjectFormPanel2 />
                    )}
                  </ErrorBoundary>
                </DialogContent>

                <DialogActions sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <Box sx={{ gridArea: '1/2' }}>
                    <RadioGroup row sx={{ justifyContent: 'center' }}>
                      <Radio
                        data-testid={dataTestId.registrationWizard.description.projectForm.panel1Button}
                        checked={selectedPanel === 0}
                        onClick={() => setSelectedPanel(0)}
                        sx={{ color: errorOnTab1 ? 'error.main' : undefined }}
                        color={errorOnTab1 ? 'error' : 'primary'}
                      />
                      <Radio
                        data-testid={dataTestId.registrationWizard.description.projectForm.panel2Button}
                        checked={selectedPanel === 1}
                        onClick={goToNextTab}
                        sx={{ color: errorOnTab2 ? 'error.main' : undefined }}
                        color={errorOnTab2 ? 'error' : 'primary'}
                      />
                    </RadioGroup>
                    {errorOnTab1 || errorOnTab2 ? (
                      <Typography color="error" sx={{ display: 'flex', justifyContent: 'center' }}>
                        {t('feedback.validation.must_correct_errors')}
                      </Typography>
                    ) : null}
                  </Box>

                  <Box sx={{ gridArea: '1/3', display: 'flex', gap: '0.5rem', justifyContent: 'end' }}>
                    <Button onClick={toggleShowConfirmCloseDialog}>{t('common.cancel')}</Button>
                    {selectedPanel === 0 ? (
                      <Button variant="contained" onClick={goToNextTab}>
                        {t('common.next')}
                      </Button>
                    ) : (
                      <LoadingButton
                        data-testid={dataTestId.registrationWizard.description.projectForm.saveProjectButton}
                        variant="contained"
                        loading={isSubmitting}
                        type="submit">
                        {t('common.save')}
                      </LoadingButton>
                    )}
                  </Box>
                </DialogActions>
              </Form>
            );
          }}
        </Formik>
      </ErrorBoundary>
      <ConfirmDialog
        open={showConfirmCloseDialog}
        title={t('project.close_view')}
        onAccept={handleClose}
        onCancel={toggleShowConfirmCloseDialog}>
        {t('project.close_view_description')}
      </ConfirmDialog>
    </Box>
  ) : null;
};

export default ProjectForm;
