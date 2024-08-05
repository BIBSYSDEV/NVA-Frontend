import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogActions, DialogContent, Radio, RadioGroup, Typography } from '@mui/material';
import { Form, Formik, FormikProps, FormikTouched } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CristinApiPath } from '../../../api/apiPaths';
import { authenticatedApiRequest } from '../../../api/apiRequest';
import { ErrorBoundary } from '../../../components/ErrorBoundary';
import { setNotification } from '../../../redux/notificationSlice';
import { CristinProject, SaveCristinProject } from '../../../types/project.types';
import { isErrorStatus, isSuccessStatus } from '../../../utils/constants';
import { dataTestId } from '../../../utils/dataTestIds';
import { basicProjectValidationSchema } from '../../../utils/validation/project/BasicProjectValidation';
import { CreateProjectStartPage } from '../../projects/form/CreateProjectStartPage';
import { ProjectFormPanel1 } from '../../projects/form/ProjectFormPanel1';
import { ProjectFormPanel2 } from '../../projects/form/ProjectFormPanel2';

interface ProjectFormDialogProps {
  onClose: () => void;
  onCreateProject?: (project: CristinProject) => void | Promise<unknown>;
  currentProject?: CristinProject;
  refetchData?: () => void;
}

type ProjectInitialValues = CristinProject | SaveCristinProject | undefined;

export interface InitialProjectFormData {
  project: ProjectInitialValues;
  suggestedProjectManager?: string;
}

const StartEmptyProject = ({ currentProject, refetchData, onClose, onCreateProject }: ProjectFormDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showConfirmCloseDialog, setShowConfirmCloseDialog] = useState(false);
  const toggleShowConfirmCloseDialog = () => setShowConfirmCloseDialog(!showConfirmCloseDialog);
  const [initialValues, setInitialValues] = useState<InitialProjectFormData>({ project: currentProject });
  const [selectedPanel, setSelectedPanel] = useState<0 | 1>(0);
  const editMode = !!currentProject;

  const handleClose = () => {
    onClose();
    setInitialValues({ project: currentProject });
    setSelectedPanel(0);
    setShowConfirmCloseDialog(false);
  };

  const submitProjectForm = async (values: SaveCristinProject) => {
    if (editMode) {
      const updateProjectResponse = await authenticatedApiRequest<CristinProject>({
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
      const createProjectResponse = await authenticatedApiRequest<CristinProject>({
        url: CristinApiPath.Project,
        method: 'POST',
        data: values,
      });

      if (isSuccessStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.success.create_project'), variant: 'success' }));
        await onCreateProject?.(createProjectResponse.data);
        handleClose();
      } else if (isErrorStatus(createProjectResponse.status)) {
        dispatch(setNotification({ message: t('feedback.error.create_project'), variant: 'error' }));
      }
    }
  };

  console.log('initialValues', initialValues);

  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column', gap: '1rem' }}>
      <ErrorBoundary>
        {!initialValues.project ? (
          <CreateProjectStartPage onClose={toggleShowConfirmCloseDialog} setInitialValues={setInitialValues} />
        ) : (
          <Formik
            initialValues={initialValues.project}
            validationSchema={basicProjectValidationSchema}
            onSubmit={submitProjectForm}>
            {({ isSubmitting, errors, setTouched, touched, values }: FormikProps<SaveCristinProject>) => {
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
        )}
      </ErrorBoundary>
    </Box>
  );
};

export default StartEmptyProject;
