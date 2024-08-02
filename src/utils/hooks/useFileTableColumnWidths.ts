import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useFileTableColumnWidths = (archived = false) => {
  const mediumWidth = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const columnWidthsWhenNotArchived = mediumWidth
    ? { nameColumn: 35, publishColumn: 12, versionColumn: 15, licenseColumn: 31, iconColumn: 7 }
    : { nameColumn: 35, publishColumn: 9, versionColumn: 24, licenseColumn: 27, iconColumn: 5 };

  const columnWidthsWhenArchived = {
    nameColumn: columnWidthsWhenNotArchived.nameColumn,
    publishColumn: columnWidthsWhenNotArchived.publishColumn,
    versionColumn: 0,
    licenseColumn: 0,
    iconColumn: 100 - columnWidthsWhenNotArchived.nameColumn - columnWidthsWhenNotArchived.publishColumn,
  };

  return archived ? columnWidthsWhenArchived : columnWidthsWhenNotArchived;
};
