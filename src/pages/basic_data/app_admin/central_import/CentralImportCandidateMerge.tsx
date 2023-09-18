import ArrowForwardIcon from '@mui/icons-material/ArrowForwardIos';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link, Redirect, useHistory, useParams } from 'react-router-dom';
import {
  fetchImportCandidate,
  fetchRegistration,
  updateImportCandidateStatus,
  updateRegistration,
} from '../../../../api/registrationApi';
import { PageSpinner } from '../../../../components/PageSpinner';
import { setNotification } from '../../../../redux/notificationSlice';
import { DescriptionFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import { displayDate } from '../../../../utils/date-helpers';
import { getImportCandidatePath, getRegistrationWizardPath } from '../../../../utils/urlPaths';

interface MergeImportCandidateParams {
  candidateIdentifier: string;
  registrationIdentifier: string;
}

export const CentralImportCandidateMerge = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { candidateIdentifier, registrationIdentifier } = useParams<MergeImportCandidateParams>();

  const registrationQuery = useQuery({
    queryKey: ['registration', registrationIdentifier],
    queryFn: () => fetchRegistration(registrationIdentifier),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const importCandidateQuery = useQuery({
    queryKey: ['importCandidate', candidateIdentifier],
    queryFn: () => fetchImportCandidate(candidateIdentifier),
    meta: { errorMessage: t('feedback.error.get_import_candidate') },
  });

  const registrationMutation = useMutation({
    mutationFn: (values: Registration) => updateRegistration(values),
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.update_registration'),
          variant: 'error',
        })
      ),
  });

  const importCandidateMutation = useMutation({
    mutationFn: () =>
      updateImportCandidateStatus(candidateIdentifier, {
        candidateStatus: 'IMPORTED',
        nvaPublicationId: registration?.id,
      }),
    onError: () =>
      dispatch(
        setNotification({
          message: t('feedback.error.update_import_status'),
          variant: 'error',
        })
      ),
  });

  const registration = registrationQuery.data;
  const importCandidate = importCandidateQuery.data;

  if (importCandidate?.importStatus.candidateStatus === 'IMPORTED') {
    return <Redirect to={getImportCandidatePath(candidateIdentifier)} />;
  }

  return registrationQuery.isLoading || importCandidateQuery.isLoading ? (
    <PageSpinner />
  ) : !registration || !importCandidate ? null : (
    <Formik
      initialValues={registration}
      onSubmit={async (values) => {
        await registrationMutation.mutateAsync(values);
        await importCandidateMutation.mutateAsync();
        dispatch(setNotification({ message: t('feedback.success.merge_import_candidate'), variant: 'success' }));
        registrationQuery.remove(); // Remove cached data, to ensure correct data is shown in wizard after redirect
        history.push(getRegistrationWizardPath(registrationIdentifier));
      }}>
      {({ values, isSubmitting }: FormikProps<Registration>) => (
        <Box
          component={Form}
          sx={{
            bgcolor: 'secondary.main',
            p: '2rem',
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}>
          <Typography sx={{ gridColumn: '1/-1' }}>
            {t('basic_data.central_import.merge_candidate.merge_details_1')}
          </Typography>
          <Typography sx={{ gridColumn: '1/-1' }}>
            {t('basic_data.central_import.merge_candidate.merge_details_2')}
          </Typography>
          <Typography variant="h1">{t('basic_data.central_import.merge_candidate.metadata_to_import')}</Typography>
          <span />
          <Typography variant="h1">{t('basic_data.central_import.merge_candidate.result_in_nva')}</Typography>

          <CompareFields
            label={t('basic_data.central_import.merge_candidate.result_id')}
            candidateValue=""
            registrationValue={values.identifier}
          />

          <CompareFields
            label={t('registration.description.date_published')}
            candidateValue={displayDate(importCandidate.entityDescription?.publicationDate)}
            registrationValue={displayDate(values.entityDescription?.publicationDate)}
          />

          <CompareFields
            label={t('common.title')}
            fieldName={DescriptionFieldNames.Title}
            candidateValue={importCandidate?.entityDescription?.mainTitle}
            registrationValue={values.entityDescription?.mainTitle}
          />

          <CompareFields
            label={t('registration.description.abstract')}
            fieldName={DescriptionFieldNames.Abstract}
            candidateValue={importCandidate?.entityDescription?.abstract}
            registrationValue={values.entityDescription?.abstract}
          />

          <CompareFields
            label={t('registration.description.description_of_content')}
            fieldName={DescriptionFieldNames.Description}
            candidateValue={importCandidate?.entityDescription?.description}
            registrationValue={values.entityDescription?.description}
          />

          <Box sx={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'end', gap: '1rem' }}>
            <Link to={getImportCandidatePath(candidateIdentifier)}>
              <Button>{t('common.cancel')}</Button>
            </Link>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting || registrationMutation.isLoading || importCandidateMutation.isLoading}>
              {t('basic_data.central_import.merge_candidate.merge')}
            </LoadingButton>
          </Box>
        </Box>
      )}
    </Formik>
  );
};

interface CompareFieldsProps {
  label: string;
  fieldName?: string;
  candidateValue: string | undefined;
  registrationValue: string | undefined;
}

const CompareFields = ({ label, fieldName, candidateValue, registrationValue }: CompareFieldsProps) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext<Registration>();

  return (
    <>
      <TextField
        size="small"
        variant="filled"
        disabled
        multiline
        label={label}
        value={candidateValue}
        InputLabelProps={{ shrink: true }}
      />
      {fieldName ? (
        <IconButton
          size="small"
          color="primary"
          sx={{ bgcolor: 'white' }}
          title={t('basic_data.central_import.merge_candidate.update_value')}
          disabled={!candidateValue || candidateValue === registrationValue}
          onClick={() => setFieldValue(fieldName, candidateValue)}>
          <ArrowForwardIcon fontSize="small" />
        </IconButton>
      ) : (
        <span />
      )}
      <TextField
        size="small"
        variant="filled"
        disabled
        multiline
        label={label}
        value={registrationValue}
        InputLabelProps={{ shrink: true }}
      />
    </>
  );
};
