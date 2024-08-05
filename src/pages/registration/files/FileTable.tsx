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
import { AssociatedFile, Uppy } from '../../../types/associatedArtifact.types';
import { Registration } from '../../../types/registration.types';
import { useFileTableColumnWidths } from '../../../utils/hooks/useFileTableColumnWidths';
import { isSameFile, isTypeWithFileVersionField } from '../../../utils/registration-helpers';
import { FileTableRow } from './FileTableRow';
import { LicenseHelperModal } from './LicenseHelperModal';
import { markForPublishId } from './PublishCheck';
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

  const showFileVersion = isTypeWithFileVersionField(values.entityDescription?.reference?.publicationInstance?.type);
  const columnWidths = useFileTableColumnWidths(archived, showFileVersion);

  const removeFile = (associatedFileIndex: number, file: AssociatedFile) => {
    const associatedArtifactsBeforeRemoval = values.associatedArtifacts.length;
    const remainingFiles = uppy.getFiles().filter((uppyFile) => uppyFile.response?.uploadURL !== file.identifier);
    uppy.setState({ files: remainingFiles });
    remove(associatedFileIndex);

    if (associatedArtifactsBeforeRemoval === 1) {
      // Ensure field is set to touched even if it's empty
      setFieldTouched(baseFieldName);
    }
  };

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
            const associatedFileIndex = values.associatedArtifacts.findIndex((artifact) => isSameFile(artifact, file));

            return (
              <FileTableRow
                key={file.identifier}
                file={file}
                removeFile={() => removeFile(associatedFileIndex, file)}
                baseFieldName={`${baseFieldName}[${associatedFileIndex}]`}
                archived={archived}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
