import {
  Box,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { UppyFile } from '@uppy/core';
import { FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { RootState } from '../../redux/store';
import { alternatingTableRowColor } from '../../themes/mainTheme';
import { AssociatedFile, AssociatedLink, NullAssociatedArtifact, Uppy } from '../../types/associatedArtifact.types';
import { licenses, LicenseUri } from '../../types/license.types';
import { FileFieldNames, SpecificLinkFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import {
  associatedArtifactIsFile,
  associatedArtifactIsLink,
  associatedArtifactIsNullArtifact,
  getAssociatedFiles,
  isDegreeWithProtectedFiles,
  isEmbargoed,
  isTypeWithFileVersionField,
  userCanEditRegistration,
  userCanUnpublishRegistration,
  userIsValidImporter,
} from '../../utils/registration-helpers';
import {
  getChannelRegisterJournalUrl,
  getChannelRegisterPublisherUrl,
} from '../public_registration/PublicPublicationContext';
import { HelperTextModal } from './HelperTextModal';
import { FileUploader } from './files_and_license_tab/FileUploader';
import { FilesTableRow } from './files_and_license_tab/FilesTableRow';
import { UnpublishableFileRow } from './files_and_license_tab/UnpublishableFileRow';
import { DoiField } from './resource_type_tab/components/DoiField';

export const administrativeAgreementId = 'administrative-agreement';

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
  const registratorPublishesMetadataOnly = customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly';

  const files = useMemo(() => getAssociatedFiles(associatedArtifacts), [associatedArtifacts]);
  const filesToPublish = files.filter((file) => !file.administrativeAgreement);
  const filesNotToPublish = files.filter((file) => file.administrativeAgreement);
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
      onBeforeFileAdded: (currentFile: UppyFile) => {
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
  const showFileVersion = isTypeWithFileVersionField(publicationInstanceType);

  const isProtectedDegree = isDegreeWithProtectedFiles(publicationInstanceType);
  const canEditFiles = userCanEditRegistration(values) || userIsValidImporter(user, values);

  function canEditFile(file: AssociatedFile) {
    if (isProtectedDegree && isEmbargoed(file.embargoDate)) {
      return !!user?.isEmbargoThesisCurator;
    }

    if (isProtectedDegree) {
      return !!user?.isThesisCurator;
    }

    if (file.type === 'PublishedFile') {
      return userCanUnpublishRegistration(values) ?? false;
    }

    return true;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
            <Paper elevation={5} component={BackgroundDiv}>
              <Typography variant="h2" gutterBottom>
                {t('registration.files_and_license.files')}
              </Typography>

              {files.length > 0 && (
                <TableContainer component={Paper} elevation={3} sx={{ mb: '2rem' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.name')}</TableCell>
                        <TableCell>{t('common.file')}</TableCell>
                        <TableCell>{t('registration.files_and_license.size')}</TableCell>
                        <TableCell id={administrativeAgreementId}>
                          {t('registration.files_and_license.administrative_agreement')}
                        </TableCell>
                        {showFileVersion && (
                          <TableCell>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                              }}>
                              <Box sx={{ display: 'flex' }}>
                                {t('common.version')}
                                <Typography color="error">*</Typography>
                              </Box>
                              <HelperTextModal
                                modalTitle={t('common.version')}
                                modalDataTestId={dataTestId.registrationWizard.files.versionModal}
                                buttonDataTestId={dataTestId.registrationWizard.files.versionHelpButton}>
                                {registratorPublishesMetadataOnly ? (
                                  <>
                                    <Typography paragraph>
                                      {t('registration.files_and_license.version_helper_text_metadata_only')}
                                    </Typography>
                                    <Typography paragraph>
                                      <Trans
                                        i18nKey="registration.files_and_license.version_accepted_helper_text_metadata_only"
                                        components={[<Box component="span" sx={{ fontWeight: 'bold' }} />]}
                                      />
                                    </Typography>
                                    <Typography paragraph>
                                      <Trans
                                        i18nKey="registration.files_and_license.version_published_helper_text_metadata_only"
                                        components={[<Box component="span" sx={{ fontWeight: 'bold' }} />]}
                                      />
                                    </Typography>
                                    <Typography paragraph>
                                      <Trans
                                        i18nKey="registration.files_and_license.version_publishing_agreement_helper_text_metadata_only"
                                        components={[<Box component="span" sx={{ fontWeight: 'bold' }} />]}
                                      />
                                    </Typography>
                                  </>
                                ) : (
                                  <>
                                    <Trans
                                      i18nKey="registration.files_and_license.version_helper_text"
                                      components={[
                                        <Typography paragraph />,
                                        <Typography paragraph>
                                          <Box component="span" sx={{ textDecoration: 'underline' }} />
                                        </Typography>,
                                      ]}
                                    />

                                    <Typography paragraph>
                                      <Trans
                                        i18nKey="registration.files_and_license.version_accepted_helper_text"
                                        components={[<Box component="span" sx={{ fontWeight: 'bold' }} />]}
                                      />
                                    </Typography>
                                    <Typography paragraph>
                                      <Trans
                                        i18nKey="registration.files_and_license.version_published_helper_text"
                                        components={[<Box component="span" sx={{ fontWeight: 'bold' }} />]}
                                      />
                                    </Typography>
                                    <Typography paragraph>
                                      <Trans
                                        i18nKey="registration.files_and_license.version_publishing_agreement_helper_text"
                                        components={[<Box component="span" sx={{ fontWeight: 'bold' }} />]}
                                      />
                                    </Typography>
                                    <Typography paragraph>
                                      <Trans
                                        i18nKey="registration.files_and_license.version_embargo_helper_text"
                                        components={[<Box component="span" sx={{ fontWeight: 'bold' }} />]}
                                      />
                                    </Typography>
                                  </>
                                )}
                              </HelperTextModal>
                            </Box>
                          </TableCell>
                        )}
                        <TableCell>
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '0.5rem',
                              alignItems: 'center',
                            }}>
                            {t('registration.files_and_license.license')}
                            <HelperTextModal
                              modalTitle={t('registration.files_and_license.licenses')}
                              modalDataTestId={dataTestId.registrationWizard.files.licenseModal}
                              buttonDataTestId={dataTestId.registrationWizard.files.licenseHelpButton}>
                              <Typography paragraph>
                                {t('registration.files_and_license.file_and_license_info')}
                              </Typography>
                              {licenses
                                .filter(
                                  (license) =>
                                    license.version === 4 ||
                                    license.id === LicenseUri.CC0 ||
                                    license.id === LicenseUri.RightsReserved
                                )
                                .map((license) => (
                                  <Box key={license.id} sx={{ mb: '1rem', whiteSpace: 'pre-wrap' }}>
                                    <Typography variant="h3" gutterBottom>
                                      {license.name}
                                    </Typography>
                                    <Box component="img" src={license.logo} alt="" sx={{ width: '8rem' }} />
                                    <Typography paragraph>{license.description}</Typography>
                                    {license.link && (
                                      <Link href={license.link} target="blank">
                                        {license.link}
                                      </Link>
                                    )}
                                  </Box>
                                ))}
                            </HelperTextModal>
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filesToPublish.map((file) => {
                        const associatedFileIndex = associatedArtifacts.findIndex((artifact) => {
                          if (associatedArtifactIsFile(artifact)) {
                            const associatedFile = artifact as AssociatedFile;
                            return associatedFile.identifier === file.identifier;
                          }
                          return false;
                        });

                        return (
                          <FilesTableRow
                            key={file.identifier}
                            file={file}
                            disabled={!canEditFile(file)}
                            removeFile={() => {
                              const associatedArtifactsBeforeRemoval = associatedArtifacts.length;
                              const remainingFiles = uppy
                                .getFiles()
                                .filter((uppyFile) => uppyFile.response?.uploadURL !== file.identifier);
                              uppy.setState({ files: remainingFiles });
                              remove(associatedFileIndex);

                              if (associatedArtifactsBeforeRemoval === 1) {
                                // Ensure field is set to touched even if it's empty
                                setFieldTouched(name);
                              }
                            }}
                            baseFieldName={`${name}[${associatedFileIndex}]`}
                            showFileVersion={showFileVersion}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {filesNotToPublish.length > 0 && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    mb: '2rem',
                  }}>
                  <Typography variant="h2">{t('registration.files_and_license.files_are_not_published')}</Typography>
                  <TableContainer component={Paper}>
                    <Table sx={alternatingTableRowColor}>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('common.name')}</TableCell>
                          <TableCell>{t('common.file')}</TableCell>
                          <TableCell>{t('registration.files_and_license.size')}</TableCell>
                          <TableCell>{t('registration.files_and_license.administrative_agreement')}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filesNotToPublish.map((file) => {
                          const associatedFileIndex = associatedArtifacts.findIndex((artifact) => {
                            if (associatedArtifactIsFile(artifact)) {
                              const associatedFile = artifact as AssociatedFile;
                              return associatedFile.identifier === file.identifier;
                            }
                            return false;
                          });

                          return (
                            <UnpublishableFileRow
                              key={file.identifier}
                              file={file}
                              disabled={!canEditFiles}
                              removeFile={() => {
                                const associatedArtifactsBeforeRemoval = associatedArtifacts.length;
                                const remainingFiles = uppy
                                  .getFiles()
                                  .filter((uppyFile) => uppyFile.response?.uploadURL !== file.identifier);
                                uppy.setState({ files: remainingFiles });
                                remove(associatedFileIndex);

                                if (associatedArtifactsBeforeRemoval === 1) {
                                  // Ensure field is set to touched even if it's empty
                                  setFieldTouched(name);
                                }
                              }}
                              baseFieldName={`${name}[${associatedFileIndex}]`}
                            />
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {customer &&
              publicationInstanceType &&
              !customer.allowFileUploadForTypes.includes(publicationInstanceType) ? (
                <Typography>{t('registration.resource_type.protected_file_type')}</Typography>
              ) : (
                <FileUploader
                  uppy={uppy}
                  addFile={(file) => {
                    const nullAssociatedArtifactIndex = associatedArtifacts.findIndex(associatedArtifactIsNullArtifact);
                    if (nullAssociatedArtifactIndex > -1) {
                      remove(nullAssociatedArtifactIndex);
                    }
                    push(file);
                  }}
                  disabled={!canEditFiles}
                />
              )}
            </Paper>
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
    </Box>
  );
};
