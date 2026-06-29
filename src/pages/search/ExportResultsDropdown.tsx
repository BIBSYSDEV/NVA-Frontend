import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ProgressDialog } from '../../components/dialogs/progress-dialog/ProgressDialog';
import { dataTestId } from '../../utils/dataTestIds';
import { bibtexExportFormat, csvExportFormat } from '../../utils/export/exportFormats';
import { useResultsExport } from '../../utils/export/useResultsExport';
import { useRegistrationsQueryParams } from '../../utils/hooks/useRegistrationSearchParams';

export const ExportResultsDropdown = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const registrationParams = useRegistrationsQueryParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [csvClicked, setCsvClicked] = useState(false);
  const [bibtexClicked, setBibtexClicked] = useState(false);

  const { exportResults, isExporting, progress } = useResultsExport(registrationParams);

  useEffect(() => {
    setCsvClicked(false);
    setBibtexClicked(false);
  }, [searchParams]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleCSVDownload = () => {
    const link = document.createElement('a');
    link.href = csvExportFormat.buildHref(searchParams);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

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
          disabled={csvClicked}
          onClick={() => {
            setCsvClicked(true);
            handleCSVDownload();
          }}>
          CSV
        </MenuItem>
        <MenuItem
          key={'bibtex'}
          disabled={bibtexClicked}
          onClick={() => {
            setBibtexClicked(true);
            handleClose();
            exportResults(bibtexExportFormat);
          }}>
          BibTex
        </MenuItem>
      </Menu>
      <ProgressDialog open={isExporting} {...progress} />
    </>
  );
};
