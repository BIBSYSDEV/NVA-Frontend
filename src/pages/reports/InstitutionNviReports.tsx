import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchResource } from '../../api/commonApi';
import { useFetchNviCandidates } from '../../api/hooks/useFetchNviCandidates';
import { RootState } from '../../redux/store';
import { OrganizationApprovalStatusDetail } from '../../types/nvi.types';
import { Organization } from '../../types/organization.types';
import { isValidUrl } from '../../utils/general-helpers';
import { getLanguageString } from '../../utils/translation-helpers';

export const InstititutionNviReports = () => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationId = user?.topOrgCristinId;

  const organizationQuery = useQuery({
    // TODO: mode to hook
    queryKey: ['organization', organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => fetchResource<Organization>(organizationId) : undefined,
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const institution = organizationQuery.data;

  const nviQuery = useFetchNviCandidates({ size: 1, aggregation: 'all' });

  const aggregationKeys = Object.keys(nviQuery.data?.aggregations?.organizationApprovalStatuses ?? {});
  const aggregationKey = aggregationKeys.find((key) => isValidUrl(key));

  const nviAggregations = (
    nviQuery.data?.aggregations?.organizationApprovalStatuses[aggregationKey ?? ''] as
      | OrganizationApprovalStatusDetail
      | undefined
  )?.organizations;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Enhet</TableCell>
              <TableCell>Kandidater</TableCell>
              <TableCell>Sjekkes</TableCell>
              <TableCell>Godkjent</TableCell>
              <TableCell>Avvist</TableCell>
              <TableCell>Totalt antall</TableCell>
              <TableCell>Publiseringsindikator</TableCell>
              <TableCell>Tvist</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {institution && (
              <OrganizationTableRow key={institution.id} organization={institution} aggregations={nviAggregations} />
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
interface OrganizationTableRowProps {
  organization: Organization;
  aggregations: any;
  level?: number;
}

const OrganizationTableRow = ({ organization, aggregations, level = 0 }: OrganizationTableRowProps) => {
  const [expanded, setExpanded] = useState(level === 0);

  const hasSubUnits = organization.hasPart && organization.hasPart.length > 0;
  const thisAggregations = aggregations?.[organization.id];

  return (
    <>
      <TableRow>
        <TableCell sx={{ pl: `${1 + level * 1.5}rem` }}>{getLanguageString(organization.labels)}</TableCell>
        <TableCell>{thisAggregations?.status.New?.docCount ?? 0}</TableCell>
        <TableCell>{thisAggregations?.status.Pending?.docCount ?? 0}</TableCell>
        <TableCell>{thisAggregations?.status.Approved?.docCount ?? 0}</TableCell>
        <TableCell>{thisAggregations?.status.Rejected?.docCount ?? 0}</TableCell>
        <TableCell>{thisAggregations?.docCount ?? 0}</TableCell>
        <TableCell>{thisAggregations?.points.value.toFixed(2) ?? 0}</TableCell>
        <TableCell>{thisAggregations?.status.Dispute?.docCount ?? 0}</TableCell>
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
