import RemoveIcon from '@mui/icons-material/HighlightOff';
import { Autocomplete, Box, IconButton, TextField, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiRequest } from '../../../../api/apiRequest';
import { PersonSearchParams, searchForPerson } from '../../../../api/cristinApi';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { Organization } from '../../../../types/organization.types';
import {
  ProjectContributor,
  ProjectContributorIdentity,
  ProjectContributorType,
  ProjectOrganization,
  SaveCristinProject,
} from '../../../../types/project.types';
import { isSuccessStatus } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { getTopLevelOrganization, getUnitTopLevelCode } from '../../../../utils/institutions-helpers';
import { getFullCristinName, getValueByKey } from '../../../../utils/user-helpers';
import { OrganizationSearchField } from '../../../basic_data/app_admin/OrganizationSearchField';
import { isProjectManager, projectContributorToCristinPerson } from './projectHelpers';

enum ProjectContributorFieldName {
  Type = 'roles[0].type',
  Identity = 'identity',
  Affiliation = 'roles[0].affiliation',
}

interface ProjectContributorRowProps {
  contributor?: ProjectContributor;
  baseFieldName: string;
  contributorIndex: number;
  removeContributor?: () => void;
  isRekProject: boolean;
}

export const ProjectContributorRow = ({
  contributor,
  baseFieldName,
  removeContributor,
  contributorIndex,
  isRekProject,
}: ProjectContributorRowProps) => {
  const { t } = useTranslation();
  const { errors, touched, setFieldValue, setFieldTouched } = useFormikContext<SaveCristinProject>();

  const [showConfirmRemoveContributor, setShowConfirmRemoveContributor] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const personQueryParams: PersonSearchParams = {
    name: debouncedSearchTerm,
  };
  const personQuery = useQuery({
    enabled: debouncedSearchTerm.length > 0,
    queryKey: ['person', 20, 1, personQueryParams],
    queryFn: () => searchForPerson(20, 1, personQueryParams),
  });

  const personSearchResult = personQuery.data?.hits ?? [];

  const [isLoadingDefaultOptions, setIsLoadingDefaultOptions] = useState(false);
  const [defaultInstitutionOptions, setDefaultInstitutionOptions] = useState<Organization[]>([]);

  const fetchSuggestedInstitutions = async (affiliationIds: string[]) => {
    if (affiliationIds.length === 0) {
      return;
    }

    setIsLoadingDefaultOptions(true);

    // Find affiliations with distinct top levels
    const distinctInstitutions = affiliationIds.reduce((accumumlator: string[], current) => {
      const currentTopLevel = getUnitTopLevelCode(current);
      if (!accumumlator.some((item) => getUnitTopLevelCode(item) === currentTopLevel)) {
        accumumlator.push(current);
      }
      return accumumlator;
    }, []);

    const defaultInstitutionsPromises = distinctInstitutions.map(async (id) => {
      const organizationResponse = await apiRequest<Organization>({ url: id });
      if (isSuccessStatus(organizationResponse.status)) {
        return getTopLevelOrganization(organizationResponse.data);
      } else {
        return;
      }
    });
    const defaultInstitutions = (await Promise.all(defaultInstitutionsPromises)).filter(
      (institution) => institution // Remove null/undefined objects
    ) as Organization[];

    setDefaultInstitutionOptions(defaultInstitutions);
    setIsLoadingDefaultOptions(false);
  };

  const contributorErrors = errors?.contributors?.[contributorIndex] as ProjectContributor;
  const isRekProjectManager = isRekProject && contributor && isProjectManager(contributor);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '150px 2fr 3fr auto' }, gap: '0.25rem 0.75rem' }}>
      <Field name={`${baseFieldName}.${ProjectContributorFieldName.Type}`}>
        {({ field }: FieldProps<ProjectContributorType>) => (
          <TextField
            data-testid={dataTestId.registrationWizard.description.projectForm.roleField}
            value={
              field.value === 'ProjectManager'
                ? t('project.project_manager')
                : field.value === 'ProjectParticipant'
                  ? t('project.project_participant')
                  : ''
            }
            disabled
            label={t('common.role')}
            variant="filled"
          />
        )}
      </Field>
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
              if (selectedPerson?.affiliations) {
                fetchSuggestedInstitutions(selectedPerson.affiliations.map((affiliation) => affiliation.organization));
              }
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
      <Field name={`${baseFieldName}.${ProjectContributorFieldName.Affiliation}`}>
        {({ field }: FieldProps<ProjectOrganization>) => (
          <OrganizationSearchField
            disabled={isRekProjectManager}
            onChange={(institution) => {
              const selectedCoordinatingInstitution: ProjectOrganization = {
                type: 'Organization',
                id: institution?.id ?? '',
                labels: institution?.labels ?? {},
              };
              setFieldTouched(`${field.name}.id`);
              setFieldValue(field.name, selectedCoordinatingInstitution);
            }}
            fieldInputProps={{
              ...field,
              onBlur: () => {
                setFieldTouched(`${field.name}.id`);
              },
            }}
            errorMessage={
              touched.contributors?.[contributorIndex]?.roles?.[0]?.affiliation?.id &&
              contributorErrors?.roles?.[0].affiliation?.id
                ? contributorErrors?.roles?.[0].affiliation?.id
                : ''
            }
            isLoadingDefaultOptions={isLoadingDefaultOptions}
            defaultOptions={defaultInstitutionOptions.filter((institution) => institution.id !== field.value?.id)}
            selectedValue={field.value}
            customDataTestId={dataTestId.registrationWizard.description.projectForm.contributorAffiliationField}
          />
        )}
      </Field>
      <IconButton
        data-testid={dataTestId.registrationWizard.description.projectForm.removeContributorButton}
        size="small"
        color="primary"
        disabled={!removeContributor}
        title={t('project.form.remove_participant')}
        onClick={() => setShowConfirmRemoveContributor(true)}>
        <RemoveIcon />
      </IconButton>
      {!!removeContributor && (
        <ConfirmDialog
          open={showConfirmRemoveContributor}
          onAccept={() => {
            removeContributor();
            setShowConfirmRemoveContributor(false);
          }}
          title={t('project.form.remove_participant')}
          onCancel={() => setShowConfirmRemoveContributor(false)}>
          <Typography>
            {t('project.form.remove_participant_text', {
              name:
                contributor?.identity.firstName && contributor?.identity.firstName
                  ? `${contributor.identity.firstName} ${contributor.identity.lastName}`
                  : t('project.project_participant').toLocaleLowerCase(),
            })}
          </Typography>
        </ConfirmDialog>
      )}
    </Box>
  );
};
