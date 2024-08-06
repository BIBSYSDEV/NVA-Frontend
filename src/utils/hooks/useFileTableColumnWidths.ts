import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useFileTableColumnWidths = (archived = false, showFileVersion = false) => {
  const mediumWidth = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const columnWidthsWhenNotArchived = mediumWidth
    ? {
        nameColumn: showFileVersion ? 35 : 50,
        publishColumn: 12,
        versionColumn: showFileVersion ? 15 : 0,
        licenseColumn: 31,
        iconColumn: 7,
      }
    : {
        nameColumn: showFileVersion ? 35 : 59,
        publishColumn: 9,
        versionColumn: showFileVersion ? 24 : 0,
        licenseColumn: 27,
        iconColumn: 5,
      };

  const columnWidthsWhenArchived = {
    nameColumn: columnWidthsWhenNotArchived.nameColumn,
    publishColumn: columnWidthsWhenNotArchived.publishColumn,
    versionColumn: 0,
    licenseColumn: 0,
    iconColumn: 100 - columnWidthsWhenNotArchived.nameColumn - columnWidthsWhenNotArchived.publishColumn,
  };

  return archived ? columnWidthsWhenArchived : columnWidthsWhenNotArchived;
};
