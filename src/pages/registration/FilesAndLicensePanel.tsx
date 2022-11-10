import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, FormHelperText, Link, Paper, TextField, Typography } from '@mui/material';
import { UppyFile } from '@uppy/core';
import { Modal } from '../../components/Modal';
import { AssociatedFile, AssociatedLink, licenses, Uppy } from '../../types/file.types';
import { FileFieldNames, SpecificLinkFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { FileUploader } from './files_and_license_tab/FileUploader';
import { FileCard } from './files_and_license_tab/FileCard';
import {
  getChannelRegisterJournalUrl,
  getChannelRegisterPublisherUrl,
} from '../public_registration/PublicPublicationContext';
import { dataTestId } from '../../utils/dataTestIds';
import {
  associatedArtifactIsFile,
  associatedArtifactIsLink,
  getAssociatedFiles,
  getAssociatedLinks,
} from '../../utils/registration-helpers';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { DoiField } from './resource_type_tab/components/DoiField';

interface FilesAndLicensePanelProps {
  uppy: Uppy;
}

export const FilesAndLicensePanel = ({ uppy }: FilesAndLicensePanelProps) => {
  const { t } = useTranslation();
  const {
    values: { associatedArtifacts, entityDescription },
    setFieldTouched,
    setFieldValue,
    errors,
    touched,
  } = useFormikContext<Registration>();
  const publicationContext = entityDescription?.reference?.publicationContext;
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const files = useMemo(() => getAssociatedFiles(associatedArtifacts), [associatedArtifacts]);

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

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {(publisherIdentifier || seriesIdentifier || journalIdentifier) && (
        <Paper elevation={5}>
          <BackgroundDiv>
            <Typography variant="h6" component="h2" gutterBottom>
              {t('registration.files_and_license.info_from_channel_register')}
            </Typography>
            {journalIdentifier && (
              <Link href={getChannelRegisterJournalUrl(journalIdentifier)} target="_blank">
                <Typography paragraph>
                  {t('registration.files_and_license.find_journal_in_channel_register')}
                </Typography>
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
          </BackgroundDiv>
        </Paper>
      )}

      <FieldArray name={FileFieldNames.AssociatedArtifacts}>
        {({ name, remove, push }: FieldArrayRenderProps) => (
          <>
            <Paper elevation={5}>
              <BackgroundDiv>
                <Typography variant="h2" gutterBottom>
                  {t('registration.files_and_license.files')}
                </Typography>
                {files.length > 0 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mb: '2rem' }}>
                    {files.map((file) => {
                      const associatedFileIndex = associatedArtifacts.findIndex((artifact) => {
                        if (associatedArtifactIsFile(artifact)) {
                          const thisFile = file as AssociatedFile;
                          const associatedFile = artifact as AssociatedFile;
                          return associatedFile.identifier === thisFile.identifier;
                        }
                        return false;
                      });

                      return (
                        <FileCard
                          key={file.identifier}
                          file={file}
                          removeFile={() => {
                            const remainingFiles = uppy
                              .getFiles()
                              .filter((uppyFile) => uppyFile.response?.uploadURL !== file.identifier);
                            uppy.setState({ files: remainingFiles });
                            remove(associatedFileIndex);

                            if (remainingFiles.length === 0) {
                              // Ensure field is set to touched even if it's empty
                              setFieldTouched(name);
                            }
                          }}
                          toggleLicenseModal={toggleLicenseModal}
                          baseFieldName={`${name}[${associatedFileIndex}]`}
                        />
                      );
                    })}
                  </Box>
                )}

                <FileUploader uppy={uppy} addFile={push} />
              </BackgroundDiv>
            </Paper>

            <Paper elevation={5}>
              <BackgroundDiv>
                <Typography variant="h2" paragraph>
                  {t('common.link')}
                </Typography>
                {entityDescription?.reference?.doi ? (
                  <DoiField />
                ) : (
                  <TextField
                    fullWidth
                    variant="filled"
                    label={t('registration.files_and_license.link_to_resource')}
                    value={getAssociatedLinks(associatedArtifacts)[0]?.id ?? ''}
                    onChange={(event) => {
                      const associatedLinkIndex = associatedArtifacts.findIndex((artifact) =>
                        associatedArtifactIsLink(artifact)
                      );

                      const inputValue = event.target.value;

                      if (inputValue) {
                        if (associatedLinkIndex < 0) {
                          const newAssociatedLink: AssociatedLink = { type: 'AssociatedLink', id: inputValue };
                          push(newAssociatedLink);
                        } else {
                          const fieldName = `${name}[${associatedLinkIndex}].${SpecificLinkFieldNames.Id}`;
                          setFieldValue(fieldName, inputValue);
                        }
                      } else {
                        remove(associatedLinkIndex);
                      }
                    }}
                  />
                )}
              </BackgroundDiv>
            </Paper>

            {files.length === 0 && typeof errors.associatedArtifacts === 'string' && touched.associatedArtifacts && (
              <FormHelperText error>
                <ErrorMessage name={name} />
              </FormHelperText>
            )}
          </>
        )}
      </FieldArray>

      <Modal
        headingText={t('registration.files_and_license.licenses')}
        open={isLicenseModalOpen}
        onClose={toggleLicenseModal}
        maxWidth="sm"
        dataTestId={dataTestId.registrationWizard.files.licenseModal}>
        {licenses.map((license) => (
          <Box key={license.identifier} sx={{ mb: '1rem', whiteSpace: 'pre-wrap' }}>
            <Typography variant="h3">{t(`licenses.labels.${license.identifier}`)}</Typography>
            <Box component="img" src={license.logo} alt="" sx={{ width: '8rem' }} />
            <Typography paragraph>{license.description}</Typography>
            {license.link && (
              <Link href={license.link} target="blank">
                {license.link}
              </Link>
            )}
          </Box>
        ))}
      </Modal>
    </Box>
  );
};
