import { Box, Autocomplete, Typography, TextField, MenuItem } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../../api/apiPaths';
import { apiRequest } from '../../../../api/apiRequest';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../../../types/common.types';
import { Organization } from '../../../../types/organization.types';
import { ProjectContributor } from '../../../../types/project.types';
import { CristinPerson } from '../../../../types/user.types';
import { isSuccessStatus } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { getTopLevelOrganization } from '../../../../utils/institutions-helpers';
import { getFullCristinName } from '../../../../utils/user-helpers';
import { OrganizationSearchField } from '../../../basic_data/app_admin/OrganizationSearchField';
import { projectContributorToCristinPerson } from './projectHelpers';

interface ProjectContributorRowProps {
  contributor?: ProjectContributor;
  baseFieldName: string;
}

export const ProjectContributorRow = ({ contributor, baseFieldName }: ProjectContributorRowProps) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [personSearchResult, isLoadingPersonSearchResult] = useFetch<SearchResponse<CristinPerson>>({
    url: debouncedSearchTerm ? `${CristinApiPath.Person}?results=20&name=${debouncedSearchTerm}` : '',
  });

  const cristinPersonContributor = projectContributorToCristinPerson(contributor);
  const contributorAffiliation = contributor?.affiliation
    ? { id: contributor.affiliation.id, name: contributor.affiliation.name }
    : undefined;

  const [isLoadingDefaultOptions, setIsLoadingDefaultOptions] = useState(false);
  const [defaultInstitutionOptions, setDefaultInstitutionOptions] = useState<Organization[]>([]);
  const fetchSuggestedInstitutions = async (affiliationIds: string[]) => {
    if (affiliationIds.length > 0) {
      setIsLoadingDefaultOptions(true);
    }
    const defaultInstitutionsPromises = affiliationIds.map(async (id) => {
      const organizationResponse = await apiRequest<Organization>({ url: id });
      if (isSuccessStatus(organizationResponse.status)) {
        return getTopLevelOrganization(organizationResponse.data);
      }
    });
    const defaultInstitutions = (await Promise.all(defaultInstitutionsPromises)).filter(
      (institution) => institution // Remove null/undefined objects
    ) as Organization[];
    setDefaultInstitutionOptions(defaultInstitutions);
    setIsLoadingDefaultOptions(false);
  };

  return (
    <>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr 3fr' }, gap: '0.5rem 1rem' }}>
        <Field name={`${baseFieldName}.type`}>
          {({ field, meta: { touched, error } }: FieldProps<string>) => (
            <TextField
              data-testid={dataTestId.registrationWizard.description.projectForm.roleField}
              {...field}
              disabled
              select
              label={t('common.role')}
              variant="filled"
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}>
              <MenuItem value="ProjectManager">{t('project.project_manager')}</MenuItem>
              <MenuItem value="ProjectParticipant">{t('project.project_participant')}</MenuItem>
            </TextField>
          )}
        </Field>
        <Field name={`${baseFieldName}.identity.id`}>
          {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
            <Autocomplete
              options={personSearchResult?.hits ?? []}
              inputMode="search"
              getOptionLabel={(option) => getFullCristinName(option.names)}
              filterOptions={(options) => options}
              onInputChange={(_, value, reason) => {
                if (reason !== 'reset') {
                  setSearchTerm(value);
                }
              }}
              defaultValue={cristinPersonContributor ?? null}
              onChange={async (_, selectedUser) => {
                if (!selectedUser) {
                  setFieldValue(field.name, '');
                } else {
                  setFieldValue(field.name, selectedUser.id ?? '');
                  if (selectedUser.affiliations) {
                    fetchSuggestedInstitutions(
                      selectedUser.affiliations.map((affiliation) => affiliation.organization)
                    );
                  }
                }
                setSearchTerm('');
              }}
              loading={isLoadingPersonSearchResult}
              renderOption={(props, option) => {
                const orgId = option.affiliations.length > 0 ? option.affiliations[0].organization ?? '' : '';
                return (
                  <li {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="subtitle1">{getFullCristinName(option.names)}</Typography>
                      {orgId && <AffiliationHierarchy unitUri={orgId} commaSeparated />}
                    </Box>
                  </li>
                );
              }}
              renderInput={(params) => (
                <AutocompleteTextField
                  onBlur={field.onBlur}
                  value={field.value}
                  name={field.name}
                  data-testid={dataTestId.registrationWizard.description.projectForm.contributorsSearchField}
                  {...params}
                  required
                  label={t('project.person')}
                  placeholder={t('project.search_for_person')}
                  errorMessage={touched && !!error ? error : ''}
                  isLoading={isLoadingPersonSearchResult}
                  showSearchIcon={!field.value}
                />
              )}
            />
          )}
        </Field>
        <Field name={`${baseFieldName}.affiliation.id`}>
          {({ field, form: { setFieldValue }, meta: { touched, error } }: FieldProps<string>) => (
            <OrganizationSearchField
              onChange={(institution) => setFieldValue(field.name, institution?.id ?? '')}
              fieldInputProps={field}
              errorMessage={touched && !!error ? error : ''}
              isLoadingDefaultOptions={isLoadingDefaultOptions}
              defaultOptions={defaultInstitutionOptions.filter((institution) => institution.id !== field.value)}
              currentValue={contributorAffiliation}
            />
          )}
        </Field>
      </Box>
    </>
  );
};
