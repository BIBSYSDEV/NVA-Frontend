import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Menu, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FetchResultsParams } from '../../../api/searchApi';
import { dataTestId } from '../../../utils/dataTestIds';
import { bibtexExportFormat, csvExportFormat } from '../../../utils/export/exportFormats';
import { useResultsExport } from '../../../utils/export/useResultsExport';
import { ProgressDialog } from '../../dialogs/progress-dialog/ProgressDialog';

interface ExportResultsDropdownProps {
  params: FetchResultsParams;
  fileNameBase?: string;
}

export const ExportResultsDropdown = ({ params, fileNameBase }: ExportResultsDropdownProps) => {
  const { t } = useTranslation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { exportResults, cancelExport, isExporting, progress } = useResultsExport(params, fileNameBase);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Button
        ref={buttonRef}
        variant="contained"
        color="tertiary"
        startIcon={<FileDownloadOutlinedIcon />}
        endIcon={!!anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        onClick={handleClick}
        loading={isExporting}
        title={t('search.export')}
        data-testid={dataTestId.startPage.advancedSearch.downloadResultsButton}>
        {t('search.export')}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              width: buttonRef.current ? buttonRef.current.offsetWidth : undefined,
            },
          },
        }}>
        <MenuItem
          key={'csv'}
          disabled={isExporting}
          onClick={() => {
            handleClose();
            exportResults(csvExportFormat);
          }}>
          CSV
        </MenuItem>
        <MenuItem
          key={'bibtex'}
          disabled={isExporting}
          onClick={() => {
            handleClose();
            exportResults(bibtexExportFormat);
          }}>
          BibTex
        </MenuItem>
      </Menu>
      <ProgressDialog open={isExporting} onCancel={cancelExport} {...progress} />
    </>
  );
};
