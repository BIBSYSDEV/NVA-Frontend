import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button, Menu, MenuItem } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { useRegistrationSearch } from '../../api/hooks/useRegistrationSearch';
import { FetchResultsParams, ResultParam } from '../../api/searchApi';
import { PublicationInstanceType } from '../../types/registration.types';
import { exportToBibTex } from '../../utils/bibtex/BibTexFactory';
import { dataTestId } from '../../utils/dataTestIds';

const files = [
  { name: 'CSV', url: '/file1.pdf' },
  { name: 'BibTex', url: '/file2.pdf' },
];

export const ExportResultsDropdown = () => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop() || '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleClose();
  };

  const maxNumberOfCitations = 500;
  const [searchParams] = useSearchParams();

  const registrationsQueryConfig: FetchResultsParams = {
    query: searchParams.get(ResultParam.Query),
    category: searchParams.get(ResultParam.Category) as PublicationInstanceType | null,
    topLevelOrganization: searchParams.get(ResultParam.TopLevelOrganization),
    contributor: searchParams.get(ResultParam.Contributor),
    fundingSource: searchParams.get(ResultParam.FundingSource),
    publisher: searchParams.get(ResultParam.Publisher),
    series: searchParams.get(ResultParam.Series),
    journal: searchParams.get(ResultParam.Journal),
    files: searchParams.get(ResultParam.Files),
    publicationYear: searchParams.get(ResultParam.PublicationYear),
    publicationYearBefore: searchParams.get(ResultParam.PublicationYearBefore),
    publicationYearSince: searchParams.get(ResultParam.PublicationYearSince),
    from: 0,
    results: maxNumberOfCitations,
  };

  const registrationsQuery = useRegistrationSearch({
    params: registrationsQueryConfig,
  });

  const exportBibTex = async () => {
    const { data } = await registrationsQuery.refetch();
    if (!!data) {
      exportToBibTex(data.hits, data.totalHits);
    }
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
        <MenuItem key={'bibtex'} onClick={exportBibTex}>
          BibTex
        </MenuItem>
      </Menu>
    </>
  );
};
