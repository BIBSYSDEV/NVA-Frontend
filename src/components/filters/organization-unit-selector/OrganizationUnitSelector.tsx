import { Box, Chip, Skeleton } from '@mui/material';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';
import { fetchOrganization } from '../../../api/cristinApi';
import { ResultParam } from '../../../api/searchApi';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getLanguageString } from '../../../utils/translation-helpers';
import { OrganizationHierarchyFilter } from './components/OrganizationHierarchyFilter';

interface OrganizationUnitSelectorProps {
  unitId: string | null;
  topLevelOrganizationQuery: UseQueryResult<Organization, unknown>;
}

export const OrganizationUnitSelector = ({ unitId, topLevelOrganizationQuery }: OrganizationUnitSelectorProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [showUnitSelection, setShowUnitSelection] = useState(false);
  const toggleShowUnitSelection = () => setShowUnitSelection(!showUnitSelection);

  const subUnitQuery = useQuery({
    enabled: !!unitId,
    queryKey: ['organization', unitId],
    queryFn: () => fetchOrganization(unitId ?? ''),
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });

  return (
    <>
      <Chip
        data-testid={dataTestId.organization.subSearchField}
        color="tertiary"
        variant="filled"
        onClick={toggleShowUnitSelection}
        label={
          unitId ? (
            subUnitQuery.isPending ? (
              <Skeleton sx={{ minWidth: '10rem' }} />
            ) : (
              getLanguageString(subUnitQuery.data?.labels)
            )
          ) : (
            <Box component="span" sx={{ textWrap: 'nowrap' }}>
              {t('common.select_unit')}
            </Box>
          )
        }
        onDelete={
          unitId
            ? () => {
                params.delete(ResultParam.From);
                params.delete(ResultParam.Unit);
                navigate({ search: params.toString() });
              }
            : undefined
        }
        sx={{ minWidth: unitId ? '15rem' : undefined }}
        disabled={!topLevelOrganizationQuery.data?.hasPart || topLevelOrganizationQuery.data?.hasPart?.length === 0}
      />

      {topLevelOrganizationQuery.data && (
        <OrganizationHierarchyFilter
          organization={topLevelOrganizationQuery.data}
          open={showUnitSelection}
          onClose={toggleShowUnitSelection}
        />
      )}
    </>
  );
};
