import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ReportApiPath } from '../../../api/apiPaths';
import { fetchExportNviData } from '../../../api/reportApi';
import { API_URL } from '../../../utils/constants';

interface ExportNviButtonProps {
  year: number;
}

export const ExportNviButton = ({ year }: ExportNviButtonProps) => {
  const { t } = useTranslation();

  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => setIsClicked(false), [year]);

  const exportQuery = useQuery({
    queryKey: ['nviExport', year],
    enabled: isClicked,
    queryFn: () => fetchExportNviData(year),
  });

  return (
    <>
      <Button
        size="small"
        startIcon={<FileDownloadOutlinedIcon />}
        variant="outlined"
        onClick={() => setIsClicked(true)}
        disabled={isClicked}>
        {t('search.export')}
      </Button>
      <Button
        size="small"
        startIcon={<FileDownloadOutlinedIcon />}
        variant="outlined"
        // onClick={() => setIsClicked(true)}
        // disabled={isClicked}
        href={`${API_URL.slice(0, -1)}${ReportApiPath.InstitutionNviApproval}/${year}`}
        download>
        {t('search.export')}
      </Button>
    </>
  );
};
