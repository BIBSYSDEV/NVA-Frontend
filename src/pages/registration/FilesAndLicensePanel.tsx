import { Box, Checkbox, FormControlLabel, Link, Paper, TextField, Typography } from '@mui/material';
import Uppy, { UppyFile } from '@uppy/core';
import { FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { AssociatedLink, FileType, NullAssociatedArtifact } from '../../types/associatedArtifact.types';
import { FileFieldNames, SpecificLinkFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import {
  associatedArtifactIsLink,
  associatedArtifactIsNullArtifact,
  getAssociatedFiles,
  isOpenFile,
  isPendingOpenFile,
  userHasAccessRight,
  userIsValidImporter,
} from '../../utils/registration-helpers';

import { FileList } from './FileList';
import { FileUploader } from './files_and_license_tab/FileUploader';
import { DoiField } from './resource_type_tab/components/DoiField';

const channelRegisterBaseUrl = 'https://kanalregister.hkdir.no/publiseringskanaler';
const getChannelRegisterJournalUrl = (pid: string) => `${channelRegisterBaseUrl}/KanalTidsskriftInfo.action?pid=${pid}`;
const getChannelRegisterPublisherUrl = (pid: string) => `${channelRegisterBaseUrl}/KanalForlagInfo.action?pid=${pid}`;

interface FilesAndLicensePanelProps {
  uppy: Uppy;
}

export const FilesAndLicensePanel = ({ uppy }: FilesAndLicensePanelProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);

  const { values, setFieldTouched, setFieldValue, errors, touched } = useFormikContext<Registration>();
  const { entityDescription, associatedArtifacts } = values;
  const publicationContext = entityDescription?.reference?.publicationContext;
  const publicationInstanceType = entityDescription?.reference?.publicationInstance?.type;

  const files = useMemo(() => getAssociatedFiles(associatedArtifacts), [associatedArtifacts]);

  const completedFiles = files.filter(
    (file) =>
      isOpenFile(file) ||
      file.type === FileType.InternalFile ||
      file.type === FileType.HiddenFile ||
      file.type === FileType.UnpublishableFile
  );
  const pendingFiles = files.filter(
    (file) =>
      isPendingOpenFile(file) || file.type === FileType.PendingInternalFile || file.type === FileType.RejectedFile
  );

  const associatedLinkIndex = associatedArtifacts.findIndex(associatedArtifactIsLink);
  const associatedLinkHasError =
    associatedLinkIndex >= 0 &&
    !!(touched.associatedArtifacts?.[associatedLinkIndex] as FormikTouched<AssociatedLink> | undefined)?.id &&
    !!(errors.associatedArtifacts?.[associatedLinkIndex] as FormikErrors<AssociatedLink> | undefined)?.id;

  const isNullAssociatedArtifact =
    associatedArtifacts.length === 1 && associatedArtifacts.some(associatedArtifactIsNullArtifact);

  const filesRef = useRef(files);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    // Avoid adding duplicated file names to an existing registration,
    // since files could have been uploaded in another session without being in uppy's current state
    uppy.setOptions({
      onBeforeFileAdded: (currentFile: UppyFile<any, any>) => {
        if (filesRef.current.some((file) => file.name === currentFile.name)) {
          uppy.info(t('registration.files_and_license.no_duplicates', { fileName: currentFile.name }), 'info', 6000);
          return false;
        }
        return true;
      },
    });
  }, [t, uppy, filesRef]);

  const publisherIdentifier =
    (publicationContext &&
      'publisher' in publicationContext &&
      publicationContext.publisher?.id?.split('/').reverse()[1]) ||
    '';
  const seriesIdentifier =
    (publicationContext && 'series' in publicationContext && publicationContext.series?.id?.split('/').reverse()[1]) ||
    '';
  const journalIdentifier =
    (publicationContext && 'id' in publicationContext && publicationContext.id?.split('/').reverse()[1]) || '';

  const originalDoi = entityDescription?.reference?.doi;

  const canEditFiles = userHasAccessRight(values, 'update') || userIsValidImporter(user, values);

  return (
    <Paper elevation={0} component={BackgroundDiv} sx={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Typography component="h2" variant="h3">
        {t('registration.files_and_license.files')}
      </Typography>
      {(publisherIdentifier || seriesIdentifier || journalIdentifier) && (
        <Paper elevation={5} component={BackgroundDiv}>
          <Typography variant="h6" component="h2" gutterBottom>
            {t('registration.files_and_license.info_from_channel_register')}
          </Typography>
          {journalIdentifier && (
            <Link href={getChannelRegisterJournalUrl(journalIdentifier)} target="_blank">
              <Typography paragraph>{t('registration.files_and_license.find_journal_in_channel_register')}</Typography>
            </Link>
          )}
          {publisherIdentifier && (
            <Link href={getChannelRegisterPublisherUrl(publisherIdentifier)} target="_blank">
              <Typography gutterBottom>
                {t('registration.files_and_license.find_publisher_in_channel_register')}
              </Typography>
            </Link>
          )}

          {seriesIdentifier && (
            <Link href={getChannelRegisterJournalUrl(seriesIdentifier)} target="_blank">
              <Typography paragraph>{t('registration.files_and_license.find_series_in_channel_register')}</Typography>
            </Link>
          )}
        </Paper>
      )}

      <FieldArray name={FileFieldNames.AssociatedArtifacts}>
        {({ name, remove, push }: FieldArrayRenderProps) => (
          <>
            {!isNullAssociatedArtifact && (
              <>
                {customer &&
                publicationInstanceType &&
                !customer.allowFileUploadForTypes.includes(publicationInstanceType) ? (
                  <Typography>{t('registration.resource_type.protected_file_type')}</Typography>
                ) : (
                  <FileUploader
                    uppy={uppy}
                    addFile={(file) => {
                      const nullAssociatedArtifactIndex = associatedArtifacts.findIndex(
                        associatedArtifactIsNullArtifact
                      );
                      if (nullAssociatedArtifactIndex > -1) {
                        remove(nullAssociatedArtifactIndex);
                      }
                      push(file);
                    }}
                    disabled={!canEditFiles}
                  />
                )}
                {pendingFiles.length > 0 && (
                  <FileList
                    title={t('registration.files_and_license.files_in_progress')}
                    files={pendingFiles}
                    uppy={uppy}
                    remove={remove}
                    baseFieldName={name}
                  />
                )}

                {completedFiles.length > 0 && (
                  <FileList
                    title={t('registration.files_and_license.files_completed')}
                    files={completedFiles}
                    uppy={uppy}
                    remove={remove}
                    baseFieldName={name}
                  />
                )}
                <Paper elevation={5} component={BackgroundDiv}>
                  <Typography variant="h2" paragraph>
                    {t('common.link')}
                  </Typography>
                  {originalDoi ? (
                    <DoiField canEditDoi={canEditFiles} />
                  ) : (
                    <TextField
                      fullWidth
                      variant="filled"
                      label={t('registration.files_and_license.link_to_resource')}
                      disabled={!canEditFiles}
                      value={
                        associatedLinkIndex >= 0 ? (associatedArtifacts[associatedLinkIndex] as AssociatedLink).id : ''
                      }
                      error={associatedLinkHasError}
                      helperText={
                        associatedLinkHasError
                          ? (errors.associatedArtifacts?.[associatedLinkIndex] as FormikErrors<AssociatedLink>).id
                          : null
                      }
                      data-testid={dataTestId.registrationWizard.files.linkToResourceField}
                      onChange={(event) => {
                        const inputValue = event.target.value;
                        if (inputValue) {
                          if (associatedLinkIndex < 0) {
                            const newAssociatedLink: AssociatedLink = {
                              type: 'AssociatedLink',
                              id: inputValue,
                            };
                            push(newAssociatedLink);
                            const nullAssociatedArtifactIndex = associatedArtifacts.findIndex(
                              associatedArtifactIsNullArtifact
                            );
                            if (nullAssociatedArtifactIndex > -1) {
                              remove(nullAssociatedArtifactIndex);
                            }
                          } else {
                            const fieldName = `${name}[${associatedLinkIndex}].${SpecificLinkFieldNames.Id}`;
                            setFieldValue(fieldName, inputValue);
                            setFieldTouched(fieldName);
                          }
                        } else {
                          const associatedArtifactsBeforeRemoval = associatedArtifacts.length;
                          remove(associatedLinkIndex);
                          if (associatedArtifactsBeforeRemoval === 1) {
                            // Ensure field is set to touched even if it's empty
                            setFieldTouched(name);
                          }
                        }
                      }}
                    />
                  )}
                </Paper>
              </>
            )}

            {(associatedArtifacts.length === 0 || isNullAssociatedArtifact) && !originalDoi && (
              <Paper elevation={5} component={BackgroundDiv}>
                <Typography variant="h2" paragraph>
                  {t('registration.files_and_license.resource_is_a_reference')}
                </Typography>
                <Box sx={{ backgroundColor: 'white', width: '100%', p: '0.25rem 1rem' }}>
                  <FormControlLabel
                    control={<Checkbox />}
                    checked={isNullAssociatedArtifact}
                    onChange={(event, checked) => {
                      if (!checked) {
                        const nullAssociatedArtifactIndex = associatedArtifacts.findIndex(
                          associatedArtifactIsNullArtifact
                        );
                        if (nullAssociatedArtifactIndex > -1) {
                          remove(nullAssociatedArtifactIndex);
                        }
                      }

                      if (associatedArtifacts.length === 0 && checked) {
                        const nullAssociatedArtifact: NullAssociatedArtifact = { type: 'NullAssociatedArtifact' };
                        push(nullAssociatedArtifact);
                      }
                    }}
                    label={t('registration.files_and_license.resource_has_no_files_or_links')}
                  />
                </Box>
              </Paper>
            )}
          </>
        )}
      </FieldArray>
    </Paper>
  );
};
