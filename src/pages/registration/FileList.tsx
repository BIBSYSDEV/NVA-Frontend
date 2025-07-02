import {
  Box,
  Divider,
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
import { OpenInNewLink } from '../../components/OpenInNewLink';
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

  const publicationInstanceType = entityDescription?.reference?.publicationInstance?.type;
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
                          <Trans
                            i18nKey="registration.files_and_license.version_helper_text"
                            components={{
                              heading: <Typography variant="h2" />,
                              p: <Typography sx={{ mb: '1rem' }} />,
                              ccLink: <OpenInNewLink href="https://creativecommons.org/share-your-work/cclicenses/" />,
                            }}
                          />
                        </HelperTextModal>
                      </Box>
                    </StyledTableCell>
                  )}

                  <StyledTableCell>
                    <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      {t('registration.files_and_license.license')}
                      <HelperTextModal
                        maxWidth="xl"
                        modalTitle={t('registration.files_and_license.licenses')}
                        modalDataTestId={dataTestId.registrationWizard.files.licenseModal}
                        buttonDataTestId={dataTestId.registrationWizard.files.licenseHelpButton}>
                        <Trans
                          i18nKey="registration.files_and_license.file_and_license_info"
                          components={{
                            p: <Typography gutterBottom />,
                            ccLink: <OpenInNewLink href="https://creativecommons.org/licenses/" />,
                          }}
                        />
                        <Divider sx={{ my: '1rem', borderColor: 'black', borderWidth: '1px' }} />
                        <Box
                          sx={{
                            display: 'grid',
                            gridTemplateColumns: { md: '1fr', lg: 'repeat(3, 1fr)' },
                            gap: '1.5rem',
                          }}>
                          {activeLicenses.map((license) => (
                            <div key={license.id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mb: '0.5rem' }}>
                                {license.logo && <img src={license.logo} alt="" style={{ width: '5rem' }} />}
                                <Typography component="h2" variant="h3">
                                  {license.name}
                                </Typography>
                              </Box>
                              <Trans
                                defaults={license.description}
                                components={{
                                  p: <Typography gutterBottom />,
                                  ul: <Box component="ul" sx={{ mt: 0, mb: '0.5rem' }} />,
                                  li: <li />,
                                }}
                              />
                              {license.link && (
                                <OpenInNewLink href={license.link}>
                                  {t('licenses.read_more_about_license', { license: license.name })}
                                </OpenInNewLink>
                              )}
                              {license.additionalInformation && (
                                <Trans
                                  defaults={license.additionalInformation}
                                  components={{
                                    p: <Typography sx={{ mt: '1rem' }} />,
                                    link1: <OpenInNewLink href="https://lovdata.no/lov/2018-06-15-40/" />,
                                  }}
                                />
                              )}
                            </div>
                          ))}
                          <div>
                            <Typography variant="h3" gutterBottom>
                              {t('licenses.labels.older_licenses')}
                            </Typography>
                            <Typography>{t('licenses.description.older_licenses')}</Typography>
                          </div>
                        </Box>
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
