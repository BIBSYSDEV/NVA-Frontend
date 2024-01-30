import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Autocomplete, Box, Button, Chip, Skeleton, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { fetchOrganization } from '../../../../api/cristinApi';
import { RootState } from '../../../../redux/store';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getSortedSubUnits } from '../../../../utils/institutions-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { UserFormData } from './UserFormDialog';

export const AreaOfResponsibility = () => {
  const { t } = useTranslation();
  const topOrgCristinId = useSelector((store: RootState) => store.user?.topOrgCristinId);
  const [addAreaOfResponsibility, setAddAreaOfResponsibility] = useState(false);

  const { values, isSubmitting } = useFormikContext<UserFormData>();
  const currentAreas = values.user?.viewingScope?.includedUnits ?? [];

  const organizationQuery = useQuery({
    enabled: !!topOrgCristinId,
    queryKey: [topOrgCristinId],
    queryFn: topOrgCristinId ? () => fetchOrganization(topOrgCristinId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });
  const currentOrganization = organizationQuery.data;
  const options = currentOrganization ? getSortedSubUnits([currentOrganization]) : [];

  return (
    <section>
      <FieldArray name="user.viewingScope.includedUnits">
        {({ push, remove }: FieldArrayRenderProps) => (
          <>
            {currentAreas.length > 0 && (
              <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', mb: '0.5rem' }}>
                {currentAreas.map((organizationId, index) => (
                  <ViewingScopeChip
                    key={organizationId}
                    organizationId={organizationId}
                    onRemove={() => remove(index)}
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
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {getLanguageString(option.labels)}
                  </li>
                )}
                disabled={isSubmitting}
                onChange={(_, value) => {
                  if (value) {
                    push(value.id);
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
          </>
        )}
      </FieldArray>
    </section>
  );
};

interface ViewingScopeChipProps {
  organizationId: string;
  onRemove: () => void;
}

const ViewingScopeChip = ({ organizationId, onRemove }: ViewingScopeChipProps) => {
  const { t } = useTranslation();
  const { isSubmitting } = useFormikContext<UserFormData>();

  const organizationQuery = useQuery({
    enabled: !!organizationId,
    queryKey: [organizationId],
    queryFn: organizationId ? () => fetchOrganization(organizationId) : undefined,
    meta: { errorMessage: t('feedback.error.get_institution') },
    staleTime: Infinity,
    cacheTime: 1_800_000, // 30 minutes
  });

  return (
    <Chip
      key={organizationId}
      color="primary"
      disabled={isSubmitting}
      label={
        organizationQuery.isLoading ? (
          <Skeleton sx={{ width: '15rem' }} />
        ) : organizationQuery.data?.labels ? (
          getLanguageString(organizationQuery.data.labels)
        ) : (
          t('common.unknown')
        )
      }
      onDelete={onRemove}
    />
  );
};
