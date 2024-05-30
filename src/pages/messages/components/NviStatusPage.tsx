import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { RootState } from '../../../redux/store';
import { OrganizationApprovalStatusDetail } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { isValidUrl } from '../../../utils/general-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

export const NviStatusPage = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const selectedYear = '2024';

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId);
  const institution = organizationQuery.data;

  // const nviPeriodQuery = useFetchNviPeriod(selectedYear);
  const nviQuery = useFetchNviCandidates({ size: 1, aggregation: 'all', year: selectedYear });
  const aggregationKeys = Object.keys(nviQuery.data?.aggregations?.organizationApprovalStatuses ?? {});
  const aggregationKey = aggregationKeys.find((key) => isValidUrl(key));

  const nviAggregations = nviQuery.data?.aggregations?.organizationApprovalStatuses[aggregationKey ?? ''] as
    | OrganizationApprovalStatusDetail
    | undefined;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Typography variant="h1">{t('search.reports.institution_nvi')}</Typography>

      {/* {nviPeriodQuery.data && (
        <Typography>
          {toDateString(nviPeriodQuery.data.startDate)} - {toDateString(nviPeriodQuery.data.reportingDate)}
        </Typography>
      )} */}

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap' }}>
              <TableCell>{t('registration.contributors.department')}</TableCell>
              <TableCell>{t('tasks.nvi.status.New')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Pending')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Approved')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Rejected')}</TableCell>
              <TableCell>{t('common.total_number')}</TableCell>
              <TableCell>{t('tasks.nvi.publication_points')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Dispute')}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {institution && <OrganizationTableRow organization={institution} aggregations={nviAggregations} />}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
interface OrganizationTableRowProps {
  organization: Organization;
  aggregations: OrganizationApprovalStatusDetail | undefined;
  level?: number;
}

const OrganizationTableRow = ({ organization, aggregations, level = 0 }: OrganizationTableRowProps) => {
  const [expanded, setExpanded] = useState(level === 0);

  const hasSubUnits = organization.hasPart && organization.hasPart.length > 0;
  const thisAggregations = aggregations?.organizations?.[organization.id];

  return (
    <>
      <TableRow>
        <TableCell sx={{ pl: `${1 + level * 1.5}rem`, py: '1rem' }}>{getLanguageString(organization.labels)}</TableCell>
        <TableCell align="center">{thisAggregations?.status.New?.docCount.toLocaleString() ?? 0}</TableCell>
        <TableCell align="center">{thisAggregations?.status.Pending?.docCount.toLocaleString() ?? 0}</TableCell>
        <TableCell align="center">{thisAggregations?.status.Approved?.docCount.toLocaleString() ?? 0}</TableCell>
        <TableCell align="center">{thisAggregations?.status.Rejected?.docCount.toLocaleString() ?? 0}</TableCell>
        <TableCell align="center">{thisAggregations?.docCount.toLocaleString() ?? 0}</TableCell>
        <TableCell align="center">
          {thisAggregations?.points.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? 0}
        </TableCell>
        <TableCell align="center">{thisAggregations?.status.Dispute?.docCount.toLocaleString() ?? 0}</TableCell>
        <TableCell>
          {hasSubUnits && level !== 0 && (
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>
      {expanded && hasSubUnits && (
        <>
          {organization.hasPart?.map((subUnit) => (
            <OrganizationTableRow
              key={subUnit.id}
              organization={subUnit}
              aggregations={aggregations}
              level={level + 1}
            />
          ))}
        </>
      )}
    </>
  );
};
