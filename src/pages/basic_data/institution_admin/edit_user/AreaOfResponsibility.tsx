import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useFetchOrganization } from '../../../../api/hooks/useFetchOrganization';
import { OrganizationRenderOption } from '../../../../components/OrganizationRenderOption';
import { RootState } from '../../../../redux/store';
import { dataTestId } from '../../../../utils/dataTestIds';
import {
  getAllChildOrganizations,
  getOrganizationHierarchy,
  getSortedSubUnits,
} from '../../../../utils/institutions-helpers';
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

  const organizationQuery = useFetchOrganization(topOrgCristinId ?? '');

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
              const allChildrenIds = getAllChildOrganizations([value]).map((unit) => unit.id);
              const allParentIds = getOrganizationHierarchy(value).map((unit) => unit.id);
              const organizationIdsToRemove = Array.from(new Set([...allChildrenIds, ...allParentIds]));

              // Remove existing organizations conflicting with the new organization
              const filteredScopes = viewingScopes.filter(
                (scope) => !organizationIdsToRemove.includes(scope) && scope !== value?.id
              );

              const newViewingScopes = Array.from(new Set([...filteredScopes, value.id]));
              updateViewingScopes(newViewingScopes);
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
          {t('common.add_custom', { name: t('editor.curators.area_of_responsibility').toLocaleLowerCase() })}
        </Button>
      )}
    </section>
  );
};
