import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SkeletonLine } from '../../../../../../../../components/skeletons/SkeletonLine';
import { HorizontalBox } from '../../../../../../../../components/styled/Wrappers';
import { NviReportLineTypeEnum } from './enums';
import { nviReportLineConfig } from './nvi-report-line-config';

interface NviReportLineProps {
  type: NviReportLineTypeEnum;
  count: string;
  isLoading: boolean;
}

export const NviReportLine = ({ type, count, isLoading }: NviReportLineProps) => {
  const { t } = useTranslation();
  const { icon, label } = nviReportLineConfig[type];

  return (
    <HorizontalBox sx={{ gap: '0.25rem' }}>
      {icon}
      <Typography sx={{ fontSize: '0.9rem' }}>
        {t(label)} ({isLoading ? <SkeletonLine sx={{ display: 'inline-flex' }} /> : count})
      </Typography>
    </HorizontalBox>
  );
};
