import { Theme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

export const useFileTableColumnWidths = (archived = false) => {
  const mediumWidth = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));
  const mobileWidth = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  console.log('mediumWidth', mediumWidth);
  console.log('mobileWidth', mobileWidth);

  const columnWidthsWhenNotArchived = () => {
    if (mobileWidth) {
      return { nameColumn: 100, publishColumn: 100, versionColumn: 100, licenseColumn: 100, iconColumn: 100 };
    } else if (mediumWidth) {
      return { nameColumn: 35, publishColumn: 13, versionColumn: 15, licenseColumn: 32, iconColumn: 5 };
    }
    return { nameColumn: 35, publishColumn: 9, versionColumn: 24, licenseColumn: 27, iconColumn: 5 };
  };

  const columnWidthsWhenArchived = () => {
    const columnWidths = columnWidthsWhenNotArchived();

    if (mobileWidth) {
      return {
        nameColumn: columnWidths.nameColumn,
        publishColumn: columnWidths.publishColumn,
        versionColumn: 0,
        licenseColumn: 0,
        iconColumn: 100,
      };
    } else if (mediumWidth) {
      return {
        nameColumn: columnWidths.nameColumn,
        publishColumn: columnWidths.publishColumn,
        versionColumn: 0,
        licenseColumn: 0,
        iconColumn: 100 - columnWidths.nameColumn - columnWidths.publishColumn,
      };
    }
    return {
      nameColumn: columnWidths.nameColumn,
      publishColumn: columnWidths.publishColumn,
      versionColumn: 0,
      licenseColumn: 0,
      iconColumn: 100 - columnWidths.nameColumn - columnWidths.publishColumn,
    };
  };

  if (archived) {
    return columnWidthsWhenArchived();
  }
  return columnWidthsWhenNotArchived();
};
