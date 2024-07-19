import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchOrganization } from '../../../../api/cristinApi';
import { OrganizationRenderOption } from '../../../../components/OrganizationRenderOption';
import { RootState } from '../../../../redux/store';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getSortedSubUnits } from '../../../../utils/institutions-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { ViewingScopeChip } from './ViewingScopeChip';

export interface AreaOfResponsibilityProps {
  viewingScopes: string[];
  updateViewingScopes: (newViewingScopes: string[]) => void;
}

export const AreaOfResponsibility = ({ viewingScopes, updateViewingScopes }: AreaOfResponsibilityProps) => {
  const { t } = useTranslation();
  const topOrgCristinId = useSelector((store: RootState) => store.user?.topOrgCristinId);
  const [addAreaOfResponsibility, setAddAreaOfResponsibility] = useState(false);

  const { isSubmitting } = useFormikContext();

  const organizationQuery = useQuery({
    enabled: !!topOrgCristinId,
    queryKey: [topOrgCristinId],
    queryFn: topOrgCristinId ? () => fetchOrganization(topOrgCristinId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    gcTime: 1_800_000, // 30 minutes
  });
  const currentOrganization = organizationQuery.data;
  const options = currentOrganization
    ? getSortedSubUnits([currentOrganization]).filter((option) => !viewingScopes.includes(option.id))
    : [];

  return (
    <section>
      {viewingScopes.length > 0 && (
        <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', mb: '0.5rem' }}>
          {viewingScopes.map((organizationId) => (
            <ViewingScopeChip
              key={organizationId}
              organizationId={organizationId}
              onDelete={
                viewingScopes.length > 1
                  ? () => updateViewingScopes(viewingScopes.filter((scope) => scope !== organizationId))
                  : undefined
              }
              disabled={isSubmitting}
            />
          ))}
        </Box>
      )}

      {addAreaOfResponsibility ? (
        <Autocomplete
          aria-label={t('editor.curators.area_of_responsibility')}
          fullWidth
          data-testid={dataTestId.myInstitutionUsersPage.areaOfResponsibilityField}
          options={options}
          getOptionLabel={(option) => getLanguageString(option.labels)}
          renderOption={({ key, ...props }, option) => (
            <OrganizationRenderOption key={option.id} props={props} option={option} />
          )}
          disabled={isSubmitting}
          onChange={(_, value) => {
            if (value) {
              updateViewingScopes([...viewingScopes, value.id]);
            }
            setAddAreaOfResponsibility(false);
          }}
          renderInput={(params) => (
            <TextField {...params} fullWidth placeholder={t('basic_data.person_register.select_unit')} />
          )}
        />
      ) : (
        <Button
          startIcon={<AddCircleOutlineIcon />}
          disabled={isSubmitting}
          onClick={() => setAddAreaOfResponsibility(true)}>
          {t('common.add')}
        </Button>
      )}
    </section>
  );
};
