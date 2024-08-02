import {
  Box,
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
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { AssociatedFile, FileType, Uppy } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { useFileTableColumnWidths } from '../../../utils/hooks/useFileTableColumnWidths';
import {
  isDegree,
  isEmbargoed,
  isSameFile,
  isTypeWithFileVersionField,
  isTypeWithRrs,
  userCanUnpublishRegistration,
} from '../../../utils/registration-helpers';
import { FilesTableRow, markForPublishId } from './FilesTableRow';
import { LicenseHelperModal } from './LicenseHelperModal';
import { VersionHelperModal } from './VersionHelperModal';

const StyledTableCell = styled(TableCell)({
  pt: '0.75rem',
  pb: '0.25rem',
  lineHeight: '1.1rem',
});

const CenteredBox = styled(Box)({
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
});

interface FileListProps {
  files: AssociatedFile[];
  uppy: Uppy;
  remove: (index: number) => any;
  baseFieldName: string;
  archived?: boolean;
}

export const FileTable = ({ files, uppy, remove, baseFieldName, archived }: FileListProps) => {
  const { t } = useTranslation();
  const { values, setFieldTouched } = useFormikContext<Registration>();
  const { entityDescription, associatedArtifacts } = values;

  const user = useSelector((store: RootState) => store.user);
  const customer = useSelector((store: RootState) => store.customer);

  const publicationInstanceType = entityDescription?.reference?.publicationInstance?.type;
  const isProtectedDegree = isDegree(publicationInstanceType);
  const showFileVersion = isTypeWithFileVersionField(publicationInstanceType);

  const columnWidths = useFileTableColumnWidths(archived, showFileVersion);

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
      return userCanUnpublishRegistration(values) ?? false;
    }

    return true;
  }

  return (
    <TableContainer component={Paper} elevation={3} sx={{ mb: '2rem', width: '100%' }}>
      <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
        <TableHead sx={{ bgcolor: 'primary.contrastText' }}>
          <TableRow>
            <StyledTableCell sx={{ width: columnWidths.nameColumn + '%' }}>{t('common.name')}</StyledTableCell>
            <StyledTableCell id={markForPublishId} sx={{ width: columnWidths.publishColumn + '%' }}>
              {t('registration.files_and_license.mark_for_publish')}
            </StyledTableCell>
            {!archived && (
              <>
                {showFileVersion && (
                  <StyledTableCell sx={{ width: columnWidths.versionColumn + '%' }}>
                    <CenteredBox>
                      <Box sx={{ display: 'flex' }}>
                        {t('common.version')}
                        <Typography color="error">*</Typography>
                      </Box>
                      <VersionHelperModal />
                    </CenteredBox>
                  </StyledTableCell>
                )}
                <StyledTableCell sx={{ width: columnWidths.licenseColumn + '%' }}>
                  <CenteredBox>
                    {t('registration.files_and_license.license')}
                    <LicenseHelperModal />
                  </CenteredBox>
                </StyledTableCell>
              </>
            )}
            <StyledTableCell sx={{ width: columnWidths.iconColumn + '%' }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file) => {
            const associatedFileIndex = associatedArtifacts.findIndex((artifact) => isSameFile(artifact, file));

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
  );
};
