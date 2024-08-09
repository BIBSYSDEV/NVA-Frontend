import {
  Box,
  Link,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AssociatedFile, FileType, Uppy } from '../../types/associatedArtifact.types';
import { licenses, LicenseUri } from '../../types/license.types';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import {
  associatedArtifactIsFile,
  isDegree,
  isEmbargoed,
  isTypeWithFileVersionField,
  isTypeWithRrs,
  userCanEditPublishedFile,
} from '../../utils/registration-helpers';
import { HelperTextModal } from './HelperTextModal';
import { FilesTableRow, markForPublishId } from './files_and_license_tab/FilesTableRow';

const StyledTableCell = styled(TableCell)({
  pt: '0.75rem',
  pb: '0.25rem',
  lineHeight: '1.1rem',
});

interface FileListProps {
  title: string;
  files: AssociatedFile[];
  uppy: Uppy;
  remove: (index: number) => any;
  baseFieldName: string;
  archived?: boolean;
}

export const FileList = ({ title, files, uppy, remove, baseFieldName, archived }: FileListProps) => {
  const { t } = useTranslation();
  const { values, setFieldTouched } = useFormikContext<Registration>();
  const { entityDescription, associatedArtifacts } = values;

  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);

  const publicationInstanceType = entityDescription?.reference?.publicationInstance?.type;
  const isProtectedDegree = isDegree(publicationInstanceType);
  const registratorPublishesMetadataOnly = customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly';
  const showFileVersion = isTypeWithFileVersionField(publicationInstanceType);

  function canEditFile(file: AssociatedFile) {
    if (isProtectedDegree && isEmbargoed(file.embargoDate)) {
      return !!user?.isEmbargoThesisCurator;
    }

    if (isProtectedDegree) {
      return !!user?.isThesisCurator;
    }

    if (values.type === 'ImportCandidate') {
      return !!user?.isInternalImporter;
    }

    if (file.type === FileType.PublishedFile) {
      return userCanEditPublishedFile(values);
    }

    return true;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
      <Typography component="h3" variant="h4">
        {title}
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ mb: '2rem', width: '100%' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'white' }}>
            <TableRow>
              <StyledTableCell>{t('common.name')}</StyledTableCell>
              <StyledTableCell id={markForPublishId}>
                {t('registration.files_and_license.mark_for_publish')}
              </StyledTableCell>
              {!archived && (
                <>
                  {showFileVersion && (
                    <StyledTableCell>
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
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography paragraph>
                                <Trans
                                  i18nKey="registration.files_and_license.version_published_helper_text_metadata_only"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography paragraph>
                                <Trans
                                  i18nKey="registration.files_and_license.version_publishing_agreement_helper_text_metadata_only"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Trans
                                i18nKey="registration.files_and_license.version_helper_text"
                                components={[
                                  <Typography paragraph key="1" />,
                                  <Typography paragraph key="2">
                                    <Box component="span" sx={{ textDecoration: 'underline' }} />
                                  </Typography>,
                                ]}
                              />

                              <Typography paragraph>
                                <Trans
                                  i18nKey="registration.files_and_license.version_accepted_helper_text"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography paragraph>
                                <Trans
                                  i18nKey="registration.files_and_license.version_published_helper_text"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography paragraph>
                                <Trans
                                  i18nKey="registration.files_and_license.version_publishing_agreement_helper_text"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography paragraph>
                                <Trans
                                  i18nKey="registration.files_and_license.version_embargo_helper_text"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                            </>
                          )}
                        </HelperTextModal>
                      </Box>
                    </StyledTableCell>
                  )}

                  <StyledTableCell>
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
                        <Typography paragraph>{t('registration.files_and_license.file_and_license_info')}</Typography>
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
                  </StyledTableCell>
                  <TableCell />
                </>
              )}
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
                      setFieldTouched(baseFieldName);
                    }
                  }}
                  baseFieldName={`${baseFieldName}[${associatedFileIndex}]`}
                  showFileVersion={showFileVersion}
                  showRrs={isTypeWithRrs(publicationInstanceType)}
                  archived={archived}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
