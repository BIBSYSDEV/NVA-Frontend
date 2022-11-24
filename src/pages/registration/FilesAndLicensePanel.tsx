import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  FormHelperText,
  Link,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from '@mui/material';
import { UppyFile } from '@uppy/core';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Modal } from '../../components/Modal';
import {
  AssociatedFile,
  AssociatedLink,
  licenses,
  NullAssociatedArtifact,
  Uppy,
} from '../../types/associatedArtifact.types';
import { FileFieldNames, SpecificLinkFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { FileUploader } from './files_and_license_tab/FileUploader';
import {
  getChannelRegisterJournalUrl,
  getChannelRegisterPublisherUrl,
} from '../public_registration/PublicPublicationContext';
import { dataTestId } from '../../utils/dataTestIds';
import {
  associatedArtifactIsFile,
  associatedArtifactIsLink,
  associatedArtifactIsNullArtifact,
  getAssociatedFiles,
} from '../../utils/registration-helpers';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { DoiField } from './resource_type_tab/components/DoiField';
import { FilesTableRow } from './files_and_license_tab/FilesTableRow';
import { alternatingTableRowColor } from '../../themes/mainTheme';

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
  const [isEmbargoModalOpen, setIsEmbargoModalOpen] = useState(false);
  const files = useMemo(() => getAssociatedFiles(associatedArtifacts), [associatedArtifacts]);
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

  const toggleLicenseModal = () => {
    setIsLicenseModalOpen(!isLicenseModalOpen);
  };

  const toggleEmbargoModal = () => {
    setIsEmbargoModalOpen(!isEmbargoModalOpen);
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

  const originalDoi = entityDescription?.reference?.doi;

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
            {isNullAssociatedArtifact ? (
              <Box sx={{ my: '1rem' }}>
                <Typography paragraph fontWeight={600}>
                  {t('registration.files_and_license.resource_has_no_files_or_links')}
                </Typography>
                <Typography paragraph>
                  {t('registration.files_and_license.resource_has_no_files_or_links_paragraph0')}
                </Typography>
                <Typography paragraph>
                  {t('registration.files_and_license.resource_has_no_files_or_links_paragraph1')}
                </Typography>
                <Button
                  sx={{ width: 'fit-content' }}
                  variant="outlined"
                  startIcon={<AttachFileIcon />}
                  onClick={() => remove(0)}>
                  {t('registration.files_and_license.add_files_or_link')}
                </Button>
              </Box>
            ) : (
              <>
                <Paper elevation={5}>
                  <BackgroundDiv>
                    <Typography variant="h2" gutterBottom>
                      {t('registration.files_and_license.files')}
                    </Typography>

                    {files.length > 0 && (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mb: '2rem' }}>
                        <TableContainer component={Paper}>
                          <Table sx={alternatingTableRowColor}>
                            <TableHead sx={{ fontWeight: 600 }}>
                              <TableRow>
                                <TableCell>
                                  <Typography fontWeight="bold">{t('common.name')}</Typography>
                                </TableCell>
                                <TableCell></TableCell>
                                <TableCell>
                                  <Typography fontWeight="bold">{t('registration.files_and_license.size')}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontWeight="bold">
                                    {t('registration.files_and_license.administrative_agreement')}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography fontWeight="bold">{t('common.version')}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Typography fontWeight="bold">
                                      {t('registration.files_and_license.embargo')}
                                    </Typography>
                                    <Tooltip title={t('common.help')}>
                                      <IconButton
                                        data-testid={dataTestId.registrationWizard.files.licenseHelpButton}
                                        onClick={toggleEmbargoModal}>
                                        <HelpOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <Typography fontWeight="bold">
                                      {t('registration.files_and_license.licens')}
                                    </Typography>
                                    <Tooltip title={t('common.help')}>
                                      <IconButton
                                        data-testid={dataTestId.registrationWizard.files.licenseHelpButton}
                                        onClick={toggleLicenseModal}>
                                        <HelpOutlineIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {files.map((file) => {
                                const associatedFileIndex = associatedArtifacts.findIndex((artifact) => {
                                  if (associatedArtifactIsFile(artifact)) {
                                    const associatedFile = artifact as AssociatedFile;
                                    return associatedFile.identifier === file.identifier;
                                  }
                                  return false;
                                });

                                return (
                                  <>
                                    <FilesTableRow
                                      file={file}
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
                                      toggleLicenseModal={toggleLicenseModal}
                                      baseFieldName={`${name}[${associatedFileIndex}]`}
                                    />
                                  </>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </TableContainer>
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
                    {originalDoi ? (
                      <DoiField />
                    ) : (
                      <TextField
                        fullWidth
                        variant="filled"
                        label={t('registration.files_and_license.link_to_resource')}
                        value={
                          associatedLinkIndex >= 0
                            ? (associatedArtifacts[associatedLinkIndex] as AssociatedLink).id
                            : ''
                        }
                        error={associatedLinkHasError}
                        helperText={
                          associatedLinkHasError
                            ? (errors.associatedArtifacts?.[associatedLinkIndex] as FormikErrors<AssociatedLink>).id
                            : null
                        }
                        onChange={(event) => {
                          const inputValue = event.target.value;
                          if (inputValue) {
                            if (associatedLinkIndex < 0) {
                              const newAssociatedLink: AssociatedLink = { type: 'AssociatedLink', id: inputValue };
                              push(newAssociatedLink);
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
                  </BackgroundDiv>
                </Paper>

                {associatedArtifacts.length === 0 &&
                  typeof errors.associatedArtifacts === 'string' &&
                  touched.associatedArtifacts && (
                    <FormHelperText error>
                      <ErrorMessage name={name} />
                    </FormHelperText>
                  )}

                {associatedArtifacts.length === 0 && !originalDoi && (
                  <Button
                    sx={{ width: 'fit-content', m: 'auto' }}
                    variant="outlined"
                    onClick={() => {
                      const nullAssociatedArtifact: NullAssociatedArtifact = { type: 'NullAssociatedArtifact' };
                      push(nullAssociatedArtifact);
                    }}>
                    {t('registration.files_and_license.resource_has_no_files_or_links')}
                  </Button>
                )}
              </>
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

      <Modal
        headingText={t('registration.files_and_license.embargo')}
        open={isEmbargoModalOpen}
        onClose={toggleEmbargoModal}
        maxWidth="sm">
        <Box>
          <Typography>{t('registration.files_and_license.file_publish_date_helper_text')}</Typography>
        </Box>
      </Modal>
    </Box>
  );
};
