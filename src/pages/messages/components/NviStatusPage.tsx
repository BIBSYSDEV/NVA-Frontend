import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchNviCandidates } from '../../../api/hooks/useFetchNviCandidates';
import { useFetchOrganization } from '../../../api/hooks/useFetchOrganization';
import { BackgroundDiv } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { OrganizationApprovalStatusDetail } from '../../../types/nvi.types';
import { Organization } from '../../../types/organization.types';
import { isValidUrl } from '../../../utils/general-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface NviStatusPageProps {
  activeYear: number | string;
}

export const NviStatusPage = ({ activeYear }: NviStatusPageProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const organizationQuery = useFetchOrganization(user?.topOrgCristinId ?? '');
  const institution = organizationQuery.data;

  const nviQuery = useFetchNviCandidates({ size: 1, aggregation: 'all', year: activeYear });
  const aggregationKeys = Object.keys(nviQuery.data?.aggregations?.organizationApprovalStatuses ?? {});
  const aggregationKey = aggregationKeys.find((key) => isValidUrl(key));
  const nviAggregations = nviQuery.data?.aggregations?.organizationApprovalStatuses[aggregationKey ?? ''] as
    | OrganizationApprovalStatusDetail
    | undefined;

  return (
    <BackgroundDiv>
      <Typography variant="h1" gutterBottom>
        {t('search.reports.institution_nvi')}
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow sx={{ whiteSpace: 'nowrap', bgcolor: '#FEFBF3' }}>
              <TableCell>{t('registration.contributors.department')}</TableCell>
              <TableCell>{t('tasks.nvi.status.New')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Pending')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Approved')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Rejected')}</TableCell>
              <TableCell>{t('common.total_number')}</TableCell>
              <TableCell>{t('tasks.nvi.publication_points')}</TableCell>
              <TableCell>{t('tasks.nvi.status.Dispute')}</TableCell>
              <TableCell>
                <Box component="span" sx={visuallyHidden}>
                  {t('tasks.nvi.show_subunits')}
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institution && <OrganizationTableRow organization={institution} aggregations={nviAggregations} />}
          </TableBody>
        </Table>
      </TableContainer>
    </BackgroundDiv>
  );
};
interface OrganizationTableRowProps {
  organization: Organization;
  aggregations?: OrganizationApprovalStatusDetail;
  level?: number;
}

const OrganizationTableRow = ({ organization, aggregations, level = 0 }: OrganizationTableRowProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(level === 0);

  const hasSubUnits = organization.hasPart && organization.hasPart.length > 0;
  const thisAggregations = aggregations?.organizations?.[organization.id];

  return (
    <>
      <TableRow sx={{ bgcolor: level % 2 === 0 ? undefined : '#FEFBF3' }}>
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
            <IconButton onClick={() => setExpanded(!expanded)} title={t('tasks.nvi.show_subunits')}>
              {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
      </TableRow>

      {expanded &&
        organization.hasPart?.map((subUnit) => (
          <OrganizationTableRow key={subUnit.id} organization={subUnit} aggregations={aggregations} level={level + 1} />
        ))}
    </>
  );
};
