import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikProps } from 'formik';
import { getLanguageByUri } from 'nva-language';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { useFetchRegistration } from '../../../../api/hooks/useFetchRegistration';
import { fetchImportCandidate, updateImportCandidateStatus, updateRegistration } from '../../../../api/registrationApi';
import { PageSpinner } from '../../../../components/PageSpinner';
import { DocumentHeadTitle } from '../../../../context/DocumentHeadTitle';
import { setNotification } from '../../../../redux/notificationSlice';
import { AssociatedLink } from '../../../../types/associatedArtifact.types';
import { BasicDataLocationState, RegistrationFormLocationState } from '../../../../types/locationState.types';
import {
  DescriptionFieldNames,
  FileFieldNames,
  JournalType,
  PublicationType,
} from '../../../../types/publicationFieldNames';
import { PublicationInstanceType, Registration } from '../../../../types/registration.types';
import { displayDate } from '../../../../utils/date-helpers';
import { getMainRegistrationType } from '../../../../utils/registration-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { getImportCandidatePath, getRegistrationWizardPath } from '../../../../utils/urlPaths';
import { CompareDoiField } from './CompareDoiField';
import { CompareFields } from './CompareFields';
import { CompareJournalFields } from './CompareJournalFields';

interface MergeImportCandidateParams extends Record<string, string | undefined> {
  candidateIdentifier: string;
  registrationIdentifier: string;
}

export const CentralImportCandidateMerge = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as BasicDataLocationState;
  const { candidateIdentifier, registrationIdentifier } = useParams<MergeImportCandidateParams>();

  const registrationQuery = useFetchRegistration(registrationIdentifier);

  const importCandidateQuery = useQuery({
    enabled: !!candidateIdentifier,
    queryKey: ['importCandidate', candidateIdentifier],
    queryFn: () => fetchImportCandidate(candidateIdentifier ?? ''),
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
      updateImportCandidateStatus(candidateIdentifier ?? '', {
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
    return <Navigate to={{ pathname: getImportCandidatePath(candidateIdentifier ?? '') }} state={locationState} />;
  }

  const getLanguageName = (languageUri?: string) => {
    if (!languageUri) {
      return '';
    }
    const language = getLanguageByUri(languageUri);
    return getLanguageString({ no: language.nob, ny: language.nno, en: language.eng });
  };

  const candidateMainType = getMainRegistrationType(
    importCandidate?.entityDescription?.reference?.publicationInstance?.type ?? ''
  );
  const registrationMainType = getMainRegistrationType(
    registration?.entityDescription?.reference?.publicationInstance?.type ?? ''
  );

  return registrationQuery.isPending || importCandidateQuery.isPending ? (
    <PageSpinner />
  ) : !registration || !importCandidate ? null : (
    <Formik
      initialValues={registration}
      onSubmit={async (values) => {
        await registrationMutation.mutateAsync(values);
        await importCandidateMutation.mutateAsync();
        await registrationQuery.refetch();
        dispatch(setNotification({ message: t('feedback.success.merge_import_candidate'), variant: 'success' }));
        navigate(getRegistrationWizardPath(registrationIdentifier ?? ''), {
          state: {
            ...locationState,
            previousPath: getImportCandidatePath(candidateIdentifier ?? ''),
          } satisfies RegistrationFormLocationState,
        });
      }}>
      {({ values, isSubmitting, setFieldValue }: FormikProps<Registration>) => (
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
          <DocumentHeadTitle>{t('basic_data.central_import.central_import')}</DocumentHeadTitle>
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
            candidateLabel={t('basic_data.central_import.merge_candidate.result_id')}
            variant="standard"
            candidateValue={candidateIdentifier}
            registrationValue={registration.identifier}
          />

          <CompareFields
            candidateLabel={t('common.doi')}
            variant="standard"
            renderCandidateValue={
              <CompareDoiField
                doi={importCandidate?.doi ?? (importCandidate?.entityDescription?.reference?.doi || '')}
              />
            }
            renderRegistrationValue={
              <CompareDoiField doi={registration.doi || registration.entityDescription?.reference?.doi || ''} />
            }
          />

          <CompareFields
            candidateLabel={t('common.category')}
            variant="standard"
            candidateValue={t(
              `registration.publication_types.${
                importCandidate.entityDescription?.reference?.publicationInstance.type as PublicationInstanceType
              }`
            )}
            registrationValue={t(
              `registration.publication_types.${
                registration.entityDescription?.reference?.publicationInstance.type as PublicationInstanceType
              }`
            )}
          />

          <CompareFields
            candidateLabel={t('registration.description.date_published')}
            variant="standard"
            candidateValue={displayDate(importCandidate.entityDescription?.publicationDate)}
            registrationValue={displayDate(registration.entityDescription?.publicationDate)}
          />

          <CompareFields
            candidateLabel={t('common.doi')}
            registrationLabel={t('registration.files_and_license.link_to_resource')}
            onOverwrite={
              !importCandidate.entityDescription?.reference?.doi ||
              registration.doi ||
              registration.entityDescription?.reference?.doi
                ? undefined
                : () => {
                    const currentAssociatedLinkIndex = values.associatedArtifacts.findIndex(
                      (artifact) => artifact.type === 'AssociatedLink'
                    );

                    if (currentAssociatedLinkIndex !== undefined && currentAssociatedLinkIndex > -1) {
                      setFieldValue(
                        `${FileFieldNames.AssociatedArtifacts}.${currentAssociatedLinkIndex}.id`,
                        importCandidate.entityDescription?.reference?.doi
                      );
                    } else {
                      setFieldValue(FileFieldNames.AssociatedArtifacts, [
                        ...(values.associatedArtifacts ?? []),
                        {
                          type: 'AssociatedLink',
                          id: importCandidate.entityDescription?.reference?.doi,
                        },
                      ]);
                    }
                  }
            }
            candidateValue={importCandidate.entityDescription?.reference?.doi}
            registrationValue={
              registration.doi ||
              registration.entityDescription?.reference?.doi ||
              (
                values.associatedArtifacts.find((artifact) => artifact.type === 'AssociatedLink') as
                  | AssociatedLink
                  | undefined
              )?.id ||
              ''
            }
          />

          <CompareFields
            candidateLabel={t('common.title')}
            onOverwrite={() => setFieldValue(DescriptionFieldNames.Title, importCandidate.entityDescription?.mainTitle)}
            candidateValue={importCandidate.entityDescription?.mainTitle}
            registrationValue={values.entityDescription?.mainTitle}
          />

          <CompareFields
            candidateLabel={t('registration.description.abstract')}
            onOverwrite={() =>
              setFieldValue(DescriptionFieldNames.Abstract, importCandidate.entityDescription?.abstract)
            }
            candidateValue={importCandidate.entityDescription?.abstract}
            registrationValue={values.entityDescription?.abstract}
          />

          <CompareFields
            candidateLabel={t('registration.description.description_of_content')}
            onOverwrite={() =>
              setFieldValue(DescriptionFieldNames.Description, importCandidate.entityDescription?.description)
            }
            candidateValue={importCandidate.entityDescription?.description}
            registrationValue={values.entityDescription?.description}
          />

          <CompareFields
            candidateLabel={t('registration.description.primary_language')}
            onOverwrite={() =>
              setFieldValue(DescriptionFieldNames.Language, importCandidate.entityDescription?.language)
            }
            candidateValue={getLanguageName(importCandidate.entityDescription?.language)}
            registrationValue={getLanguageName(values.entityDescription?.language)}
          />

          {candidateMainType === PublicationType.PublicationInJournal &&
            importCandidate.entityDescription?.reference?.publicationInstance.type !== JournalType.Corrigendum &&
            registrationMainType === PublicationType.PublicationInJournal &&
            registration.entityDescription?.reference?.publicationInstance.type !== JournalType.Corrigendum && (
              <CompareJournalFields importCandidate={importCandidate} />
            )}

          <Box sx={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'end', gap: '1rem' }}>
            <Button onClick={() => navigate(-1)}>{t('common.cancel')}</Button>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting || registrationMutation.isPending || importCandidateMutation.isPending}>
              {t('basic_data.central_import.merge_candidate.merge')}
            </LoadingButton>
          </Box>
        </Box>
      )}
    </Formik>
  );
};
