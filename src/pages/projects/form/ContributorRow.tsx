import { Autocomplete, Box, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import {
  ProjectContributor,
  ProjectContributorFieldName,
  ProjectContributorIdentity,
  ProjectContributorType,
  ProjectFieldName,
  SaveCristinProject,
} from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { useDebounce } from '../../../utils/hooks/useDebounce';
import { getFullCristinName, getValueByKey } from '../../../utils/user-helpers';
import {
  isProjectManager,
  projectContributorToCristinPerson,
} from '../../registration/description_tab/projects_field/projectHelpers';

interface ContributorRowProps {
  contributorIndex: number;
  isRekProject: boolean;
  baseFieldName: string;
  contributor?: ProjectContributor;
  removeContributor?: () => void;
}

export const ContributorRow = ({
  contributorIndex,
  isRekProject,
  baseFieldName,
  contributor,
  removeContributor,
}: ContributorRowProps) => {
  const { t } = useTranslation();
  const { errors, touched, setFieldValue, setFieldTouched } = useFormikContext<SaveCristinProject>();
  const [showConfirmRemoveContributor, setShowConfirmRemoveContributor] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const personQuery = useFetchPerson(debouncedSearchTerm);
  const personSearchResult = personQuery.data?.hits ?? [];

  const isRekProjectManager = isRekProject && contributor && isProjectManager(contributor);
  const contributorErrors = errors?.contributors?.[contributorIndex] as ProjectContributor;

  //const [isLoadingDefaultOptions, setIsLoadingDefaultOptions] = useState(false);
  //const [defaultInstitutionOptions, setDefaultInstitutionOptions] = useState<Organization[]>([]);

  //const fetchSuggestedInstitutions = async (affiliationIds: string[])

  return (
    <TableRow sx={{ td: { verticalAlign: 'top' } }}>
      <TableCell align="left">
        <Box sx={{ display: 'flex', alignItems: 'end' }}>
          <Field name={`${baseFieldName}.${ProjectFieldName.RoleType}`}>
            {({ field }: FieldProps<ProjectContributorType>) => (
              <TextField
                data-testid={dataTestId.registrationWizard.description.projectForm.roleField}
                label={t('common.role')}
                value={
                  field.value === 'ProjectManager'
                    ? t('project.project_manager')
                    : field.value === 'ProjectParticipant'
                      ? t('project.project_participant')
                      : ''
                }
                disabled
                fullWidth
                variant="filled"
              />
            )}
          </Field>
        </Box>
      </TableCell>
      <TableCell>
        <Field name={`${baseFieldName}.${ProjectContributorFieldName.Identity}`}>
          {({ field }: FieldProps<ProjectContributorIdentity>) => (
            <Autocomplete
              options={personSearchResult}
              disabled={isRekProjectManager}
              inputMode="search"
              getOptionLabel={(option) => getFullCristinName(option.names)}
              filterOptions={(options) => options}
              onInputChange={(_, value, reason) => {
                if (reason !== 'reset') {
                  setSearchTerm(value);
                }
              }}
              defaultValue={projectContributorToCristinPerson(field.value)}
              onChange={(_, selectedPerson) => {
                const selectedContributorIdentity: ProjectContributorIdentity = {
                  type: 'Person',
                  id: selectedPerson?.id ?? '',
                  firstName: getValueByKey('FirstName', selectedPerson?.names),
                  lastName: getValueByKey('LastName', selectedPerson?.names),
                };
                setFieldValue(field.name, selectedContributorIdentity);
                //if (selectedPerson?.affiliations) {
                //fetchSuggestedInstitutions(selectedPerson.affiliations.map((affiliation) => affiliation.organization));
                //}
                setSearchTerm('');
              }}
              loading={personQuery.isFetching}
              renderOption={({ key, ...props }, option) => {
                const orgId = option.affiliations.length > 0 ? (option.affiliations[0].organization ?? '') : '';

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
                  {...params}
                  onBlur={() => setFieldTouched(`${field.name}.id`)}
                  value={field.value}
                  name={field.name}
                  data-testid={dataTestId.registrationWizard.description.projectForm.contributorsSearchField}
                  required
                  label={t('project.person')}
                  placeholder={t('project.form.search_for_person')}
                  errorMessage={
                    touched.contributors?.[contributorIndex]?.identity?.id && !!contributorErrors?.identity?.id
                      ? contributorErrors?.identity?.id
                      : ''
                  }
                  isLoading={personQuery.isFetching}
                  showSearchIcon={!field.value.id}
                />
              )}
            />
          )}
        </Field>
      </TableCell>
    </TableRow>
  );
};
