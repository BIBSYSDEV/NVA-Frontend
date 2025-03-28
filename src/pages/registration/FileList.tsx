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
import { visuallyHidden } from '@mui/utils';
import Uppy from '@uppy/core';
import { useFormikContext } from 'formik';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { AssociatedFile } from '../../types/associatedArtifact.types';
import { Registration } from '../../types/registration.types';
import { dataTestId } from '../../utils/dataTestIds';
import { activeLicenses } from '../../utils/fileHelpers';
import {
  associatedArtifactIsFile,
  isCategoryWithFileVersion,
  isCategoryWithRrs,
  isOpenFile,
  isPendingOpenFile,
} from '../../utils/registration-helpers';
import { FilesTableRow } from './files_and_license_tab/FilesTableRow';
import { HelperTextModal } from './HelperTextModal';

const StyledTableCell = styled(TableCell)({
  pt: '0.75rem',
  pb: '0.25rem',
  lineHeight: '1.1rem',
});

interface FileListProps {
  title: string;
  files: AssociatedFile[];
  uppy?: Uppy;
  remove: (index: number) => any;
  baseFieldName: string;
}

export const FileList = ({ title, files, uppy, remove, baseFieldName }: FileListProps) => {
  const { t } = useTranslation();
  const { values, setFieldTouched } = useFormikContext<Registration>();
  const { entityDescription, associatedArtifacts } = values;

  const customer = useSelector((store: RootState) => store.customer);

  const publicationInstanceType = entityDescription?.reference?.publicationInstance?.type;
  const registratorPublishesMetadataOnly = customer?.publicationWorkflow === 'RegistratorPublishesMetadataOnly';
  const showFileVersion = isCategoryWithFileVersion(publicationInstanceType);
  const isRrsApplicableCategory = isCategoryWithRrs(publicationInstanceType);
  const showAllColumns = files.some((file) => isOpenFile(file) || isPendingOpenFile(file));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <Typography component="h3" variant="h4">
        {title}
      </Typography>
      <TableContainer component={Paper} elevation={3} sx={{ mb: '2rem', width: '100%' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'white' }}>
            <TableRow>
              <StyledTableCell>{t('common.name')}</StyledTableCell>
              <StyledTableCell>{t('registration.files_and_license.availability')}</StyledTableCell>
              {showAllColumns && (
                <>
                  {showFileVersion && (
                    <StyledTableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                              <Typography sx={{ mb: '1rem' }}>
                                {t('registration.files_and_license.version_helper_text_metadata_only')}
                              </Typography>
                              <Typography sx={{ mb: '1rem' }}>
                                <Trans
                                  i18nKey="registration.files_and_license.version_accepted_helper_text_metadata_only"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography sx={{ mb: '1rem' }}>
                                <Trans
                                  i18nKey="registration.files_and_license.version_published_helper_text_metadata_only"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography sx={{ mb: '1rem' }}>
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
                                components={[<Typography sx={{ mb: '1rem' }} key="1" />]}
                                values={{ buttonText: t('my_page.messages.get_curator_support') }}
                              />
                              <Typography sx={{ mb: '1rem' }}>
                                <Trans
                                  i18nKey="registration.files_and_license.version_accepted_helper_text"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography sx={{ mb: '1rem' }}>
                                <Trans
                                  i18nKey="registration.files_and_license.version_published_helper_text"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography sx={{ mb: '1rem' }}>
                                <Trans
                                  i18nKey="registration.files_and_license.version_publishing_agreement_helper_text"
                                  components={[<Box key="1" component="span" sx={{ fontWeight: 'bold' }} />]}
                                />
                              </Typography>
                              <Typography sx={{ mb: '1rem' }}>
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
                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {t('registration.files_and_license.license')}
                      <HelperTextModal
                        modalTitle={t('registration.files_and_license.licenses')}
                        modalDataTestId={dataTestId.registrationWizard.files.licenseModal}
                        buttonDataTestId={dataTestId.registrationWizard.files.licenseHelpButton}>
                        <Typography sx={{ mb: '1rem' }}>
                          {t('registration.files_and_license.file_and_license_info')}
                        </Typography>
                        {activeLicenses.map((license) => (
                          <Box key={license.id} sx={{ mb: '1rem', whiteSpace: 'pre-wrap' }}>
                            <Typography variant="h3" gutterBottom>
                              {license.name}
                            </Typography>
                            <Box component="img" src={license.logo} alt="" sx={{ width: '8rem' }} />
                            <Typography sx={{ mb: '1rem' }}>{license.description}</Typography>
                            {license.link && (
                              <Link href={license.link} target="blank">
                                {license.link}
                              </Link>
                            )}
                            {license.additionalInformation && (
                              <Trans
                                defaults={license.additionalInformation}
                                components={{
                                  p: <Typography sx={{ mt: '1rem' }} />,
                                  ol: <ol style={{ listStyleType: 'lower-roman' }} />,
                                  li: <li style={{ marginBottom: '0.5rem' }} />,
                                }}
                              />
                            )}
                          </Box>
                        ))}
                      </HelperTextModal>
                    </Box>
                  </StyledTableCell>
                  <TableCell>
                    <span style={visuallyHidden}>{t('common.actions')}</span>
                  </TableCell>
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
                  removeFile={() => {
                    const associatedArtifactsBeforeRemoval = associatedArtifacts.length;
                    if (uppy) {
                      const uppyFiles = uppy.getFiles();
                      const uppyId = uppyFiles.find(
                        (uppyFile) => uppyFile.response?.body?.identifier === file.identifier
                      )?.id;
                      if (uppyId) {
                        uppy.removeFile(uppyId);
                      }
                    }
                    remove(associatedFileIndex);

                    if (associatedArtifactsBeforeRemoval === 1) {
                      // Ensure field is set to touched even if it's empty
                      setFieldTouched(baseFieldName);
                    }
                  }}
                  baseFieldName={`${baseFieldName}[${associatedFileIndex}]`}
                  showFileVersion={showFileVersion}
                  isRrsApplicableCategory={isRrsApplicableCategory}
                  showAllColumns={showAllColumns}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
