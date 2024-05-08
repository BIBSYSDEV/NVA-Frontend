import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, Formik, FormikProps } from 'formik';
import { getLanguageByUri } from 'nva-language';
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
import { AssociatedLink } from '../../../../types/associatedArtifact.types';
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
import { CompareFields } from './CompareFields';
import { CompareJournalFields } from './CompareJournalFields';

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
        history.push(getRegistrationWizardPath(registrationIdentifier));
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
            candidateValue={importCandidate.doi || importCandidate.entityDescription?.reference?.doi}
            registrationValue={registration.doi || registration.entityDescription?.reference?.doi}
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
            onOverwrite={() => {
              if (!importCandidate.entityDescription?.reference?.doi) {
                return;
              }
              const currentAssociatedLinkIndex = values.associatedArtifacts.findIndex(
                (artifact) => artifact.type === 'AssociatedLink'
              );

              if (currentAssociatedLinkIndex !== undefined && currentAssociatedLinkIndex > -1) {
                setFieldValue(
                  `${FileFieldNames.AssociatedArtifacts}.${currentAssociatedLinkIndex}.id`,
                  importCandidate.entityDescription.reference.doi
                );
              } else {
                setFieldValue(FileFieldNames.AssociatedArtifacts, [
                  ...(values.associatedArtifacts ?? []),
                  {
                    type: 'AssociatedLink',
                    id: importCandidate.entityDescription.reference.doi,
                  },
                ]);
              }
            }}
            candidateValue={importCandidate.entityDescription?.reference?.doi}
            registrationValue={
              (
                values.associatedArtifacts.find((artifact) => artifact.type === 'AssociatedLink') as
                  | AssociatedLink
                  | undefined
              )?.id ?? ''
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
            <Link to={getImportCandidatePath(candidateIdentifier)}>
              <Button>{t('common.cancel')}</Button>
            </Link>
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
