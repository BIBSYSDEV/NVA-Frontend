import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getById } from '../../../api/commonApi';
import { fetchUsers } from '../../../api/roleApi';
import { ListSkeleton } from '../../../components/ListSkeleton';
import { OrganizationRenderOption } from '../../../components/OrganizationRenderOption';
import { RootState } from '../../../redux/store';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../utils/general-helpers';
import { getSortedSubUnits } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { rolesWithAreaOfResponsibility } from '../../basic_data/institution_admin/edit_user/TasksFormSection';
import { OrganizationCuratorsAccordion } from './OrganizationCuratorsAccordion';

export interface OrganizationCuratorsProps {
  heading: string;
  canEditUsers?: boolean;
}

export const OrganizationCurators = ({ heading, canEditUsers = false }: OrganizationCuratorsProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);
  const organizationId = user?.topOrgCristinId;
  const customerId = user?.customerId;

  const [searchId, setSearchId] = useState('');

  const organizationQuery = useQuery({
    queryKey: [organizationId],
    enabled: !!organizationId,
    queryFn: organizationId ? () => getById<Organization>(organizationId) : undefined,
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
    meta: { errorMessage: t('feedback.error.get_institution') },
  });

  const curatorsQuery = useQuery({
    queryKey: ['curators', customerId],
    enabled: !!customerId,
    queryFn: () => (customerId ? fetchUsers(customerId, rolesWithAreaOfResponsibility) : undefined),
    meta: { errorMessage: t('feedback.error.get_users_for_institution') },
  });

  const allSubUnits = getSortedSubUnits(organizationQuery.data?.hasPart);

  return (
    <>
      <Helmet>
        <title>{heading}</title>
      </Helmet>
      <Typography variant="h1" sx={{ mb: '1rem' }}>
        {heading}
      </Typography>

      {organizationQuery.isLoading || curatorsQuery.isLoading ? (
        <ListSkeleton height={100} minWidth={100} />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Autocomplete
            data-testid={dataTestId.editor.organizationOverviewSearchField}
            options={allSubUnits}
            inputMode="search"
            getOptionLabel={(option) => getLanguageString(option.labels)}
            renderOption={(props, option) => <OrganizationRenderOption key={option.id} props={props} option={option} />}
            filterOptions={(options, state) =>
              options.filter(
                (option) =>
                  Object.values(option.labels).some((label) =>
                    label.toLowerCase().includes(state.inputValue.toLowerCase())
                  ) || getIdentifierFromId(option.id).includes(state.inputValue)
              )
            }
            getOptionKey={(option) => option.id}
            onChange={(_, selectedUnit) => setSearchId(selectedUnit?.id ?? '')}
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label={t('search.search_for_sub_unit')} />
            )}
          />

          {organizationQuery.data && (
            <OrganizationCuratorsAccordion
              organization={organizationQuery.data}
              searchId={searchId}
              curators={curatorsQuery.data ?? []}
              refetchCurators={curatorsQuery.refetch}
              canEditUsers={canEditUsers}
            />
          )}
        </Box>
      )}
    </>
  );
};
