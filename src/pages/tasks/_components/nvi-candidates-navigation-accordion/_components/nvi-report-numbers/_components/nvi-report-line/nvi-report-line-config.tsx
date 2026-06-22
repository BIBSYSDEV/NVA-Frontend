import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { ParseKeys } from 'i18next';
import { ReactElement } from 'react';
import { NviReportLineTypeEnum } from './enums';

interface NviReportLineConfigProps {
  label: ParseKeys;
  icon: ReactElement;
}

export const nviReportLineConfig: Record<NviReportLineTypeEnum, NviReportLineConfigProps> = {
  [NviReportLineTypeEnum.Candidates]: {
    label: 'tasks.nvi.candidates',
    icon: <HourglassEmptyIcon aria-hidden="true" sx={{ fontSize: 'medium' }} />,
  },
  [NviReportLineTypeEnum.Controlling]: {
    label: 'controlling',
    icon: <HourglassEmptyIcon aria-hidden="true" sx={{ fontSize: 'medium' }} />,
  },
  [NviReportLineTypeEnum.Approved]: {
    label: 'tasks.nvi.status.Approved',
    icon: <CheckIcon aria-hidden="true" sx={{ fontSize: 'medium' }} />,
  },
  [NviReportLineTypeEnum.Rejected]: {
    label: 'tasks.nvi.status.Rejected',
    icon: <CloseIcon aria-hidden="true" sx={{ fontSize: 'medium' }} />,
  },
};
