import { Autocomplete, Button, CircularProgress, TextField, Typography } from '@mui/material';
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

interface TasksFormSectionProps {
  isLoadingUser: boolean;
}

export const TasksFormSection = ({ isLoadingUser }: TasksFormSectionProps) => {
  const { t } = useTranslation();
  const topOrgCristinId = useSelector((store: RootState) => store.user?.topOrgCristinId);
  const { isSubmitting } = useFormikContext<UserFormData>();
  const [addAreaOfResponsibility, setAddAreaOfResponsibility] = useState(false);

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
      <Typography variant="h3" gutterBottom>
        Ansvarsområder
      </Typography>
      {isLoadingUser ? (
        <CircularProgress />
      ) : (
        <FieldArray name="user.viewingScope">
          {({ name, push, remove }: FieldArrayRenderProps) => (
            <>
              {addAreaOfResponsibility ? (
                <Autocomplete
                  aria-label={t('editor.curators.area_of_responsibility')}
                  data-testid={dataTestId.myInstitutionUsersPage.areaOfResponsibilityField}
                  options={options}
                  // value={selectedOption}
                  getOptionLabel={(option) => getLanguageString(option.labels)}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      {getLanguageString(option.labels)}
                    </li>
                  )}
                  disabled={isSubmitting}
                  onChange={(_, value) => setAddAreaOfResponsibility(false)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      disabled={isSubmitting}
                      fullWidth
                      placeholder={t('editor.curators.area_of_responsibility_placeholder')}
                    />
                  )}
                />
              ) : (
                <Button variant="outlined" onClick={() => setAddAreaOfResponsibility(true)}>
                  Legg til
                </Button>
              )}
            </>
          )}
        </FieldArray>
      )}
    </section>
  );
};
