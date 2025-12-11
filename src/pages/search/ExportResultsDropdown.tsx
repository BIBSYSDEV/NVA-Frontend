import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, Menu, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SearchApiPath } from '../../api/apiPaths';
import { API_URL } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { useSearchParams } from 'react-router';
import { useBibtexExport } from '../../utils/bibtex/useBibtexExport';

export const ExportResultsDropdown = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const exportBibTex = useBibtexExport();
  const csvUrl = `${API_URL.slice(0, -1)}${SearchApiPath.RegistrationsExport}?${searchParams.toString()}`;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleCSVDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || '';
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
        <MenuItem key={'csv'} onClick={() => handleCSVDownload(csvUrl)}>
          CSV
        </MenuItem>
        <MenuItem key={'bibtex'} onClick={exportBibTex}>
          BibTex
        </MenuItem>
      </Menu>
    </>
  );
};
