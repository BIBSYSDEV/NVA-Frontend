import { Box } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useUppy } from '@uppy/react';
import { Form, Formik, FormikErrors, FormikProps, validateYupSchema, yupToFormErrors } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createRegistrationFromImportCandidate, fetchImportCandidate } from '../../../../api/registrationApi';
import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { PageHeader } from '../../../../components/PageHeader';
import { PageSpinner } from '../../../../components/PageSpinner';
import { RequiredDescription } from '../../../../components/RequiredDescription';
import { SkipLink } from '../../../../components/SkipLink';
import { BackgroundDiv } from '../../../../components/styled/Wrappers';
import { setNotification } from '../../../../redux/notificationSlice';
import { ImportCandidate } from '../../../../types/importCandidate.types';
import { RegistrationTab } from '../../../../types/registration.types';
import { getTouchedTabFields } from '../../../../utils/formik-helpers/formik-helpers';
import { getTitleString } from '../../../../utils/registration-helpers';
import { createUppy } from '../../../../utils/uppy/uppy-config';
import { getImportCandidatePath, IdentifierParams } from '../../../../utils/urlPaths';
import { registrationValidationSchema } from '../../../../utils/validation/registration/registrationValidation';
import { ContributorsPanel } from '../../../registration/ContributorsPanel';
import { DescriptionPanel } from '../../../registration/DescriptionPanel';
import { FilesAndLicensePanel } from '../../../registration/FilesAndLicensePanel';
import { RegistrationFormStepper } from '../../../registration/RegistrationFormStepper';
import { ResourceTypePanel } from '../../../registration/ResourceTypePanel';
import { CentralImportCandidateFormActions } from './CentralImportCandidateFormActions';

export const CentralImportCandidateForm = () => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { identifier } = useParams<IdentifierParams>();
  const navigate = useNavigate();
  const location = useLocation();
  const uppy = useUppy(createUppy(i18n.language));

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidate', identifier],
    queryFn: () => fetchImportCandidate(identifier ?? ''),
    meta: { errorMessage: t('feedback.error.get_import_candidate') },
  });
  const importCandidate = importCandidateQuery.data;

  const initialTabNumber = new URLSearchParams(location.search).get('tab');
  const [tabNumber, setTabNumber] = useState(initialTabNumber ? +initialTabNumber : RegistrationTab.Description);

  const importCandidateMutation = useMutation({
    mutationFn: async (values: ImportCandidate) => await createRegistrationFromImportCandidate(values),
    onSuccess: () => {
      dispatch(
        setNotification({
          message: t('feedback.success.create_registration'),
          variant: 'success',
        })
      );
      navigate(-1);
    },
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.create_registration'),
          variant: 'error',
        })
      ),
  });

  if (importCandidate?.importStatus.candidateStatus === 'IMPORTED' && identifier) {
    return <Navigate to={getImportCandidatePath(identifier)} />;
  }

  const validateForm = (values: ImportCandidate): FormikErrors<ImportCandidate> => {
    const publicationInstance = values.entityDescription?.reference?.publicationInstance;

    try {
      validateYupSchema<ImportCandidate>(values, registrationValidationSchema, true, {
        publicationInstanceType: publicationInstance?.type ?? '',
        publicationStatus: importCandidate?.status,
      });
    } catch (err) {
      return yupToFormErrors(err);
    }
    return {};
  };

  return (
    <Box sx={{ justifySelf: 'center', width: '100%', maxWidth: (theme) => theme.breakpoints.values.lg }}>
      {importCandidateQuery.isPending ? (
        <PageSpinner aria-label={t('common.result')} />
      ) : importCandidate ? (
        <>
          <SkipLink href="#form">{t('common.skip_to_schema')}</SkipLink>
          <Formik
            initialValues={importCandidate}
            validate={validateForm}
            initialErrors={validateForm(importCandidate)}
            initialTouched={getTouchedTabFields(RegistrationTab.FilesAndLicenses, importCandidate)}
            onSubmit={(values) => importCandidateMutation.mutate(values)}>
            {({ values }: FormikProps<ImportCandidate>) => (
              <Form noValidate>
                <PageHeader variant="h1">{getTitleString(values.entityDescription?.mainTitle)}</PageHeader>
                <RegistrationFormStepper tabNumber={tabNumber} setTabNumber={setTabNumber} />
                <RequiredDescription />
                <BackgroundDiv sx={{ bgcolor: 'secondary.main' }}>
                  <Box id="form" mb="2rem">
                    {tabNumber === RegistrationTab.Description && (
                      <ErrorBoundary>
                        <DescriptionPanel />
                      </ErrorBoundary>
                    )}
                    {tabNumber === RegistrationTab.ResourceType && (
                      <ErrorBoundary>
                        <ResourceTypePanel />
                      </ErrorBoundary>
                    )}
                    {tabNumber === RegistrationTab.Contributors && (
                      <ErrorBoundary>
                        <ContributorsPanel />
                      </ErrorBoundary>
                    )}
                    {tabNumber === RegistrationTab.FilesAndLicenses && (
                      <ErrorBoundary>
                        <FilesAndLicensePanel uppy={uppy} />
                      </ErrorBoundary>
                    )}
                  </Box>
                  <CentralImportCandidateFormActions tabNumber={tabNumber} setTabNumber={setTabNumber} />
                </BackgroundDiv>
              </Form>
            )}
          </Formik>
        </>
      ) : null}
    </Box>
  );
};
