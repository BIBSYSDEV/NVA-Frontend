import { Box, Autocomplete, Typography, TextField, IconButton } from '@mui/material';
import RemoveIcon from '@mui/icons-material/HighlightOff';
import { Field, FieldProps, FormikErrors, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CristinApiPath } from '../../../../api/apiPaths';
import { apiRequest } from '../../../../api/apiRequest';
import { AutocompleteTextField } from '../../../../components/AutocompleteTextField';
import { AffiliationHierarchy } from '../../../../components/institution/AffiliationHierarchy';
import { SearchResponse } from '../../../../types/common.types';
import { Organization } from '../../../../types/organization.types';
import {
  ProjectContributor,
  ProjectContributorIdentity,
  ProjectContributorType,
  ProjectOrganization,
  SaveCristinProject,
} from '../../../../types/project.types';
import { CristinPerson } from '../../../../types/user.types';
import { isSuccessStatus } from '../../../../utils/constants';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useDebounce } from '../../../../utils/hooks/useDebounce';
import { useFetch } from '../../../../utils/hooks/useFetch';
import { getTopLevelOrganization, getUnitTopLevelCode } from '../../../../utils/institutions-helpers';
import { getFullCristinName, getValueByKey } from '../../../../utils/user-helpers';
import { OrganizationSearchField } from '../../../basic_data/app_admin/OrganizationSearchField';
import { projectContributorToCristinPerson } from './projectHelpers';
import { ConfirmDialog } from '../../../../components/ConfirmDialog';

enum ProjectContributorFieldName {
  Type = 'type',
  Identity = 'identity',
  Affiliation = 'affiliation',
}

interface ProjectContributorRowProps {
  contributor?: ProjectContributor;
  baseFieldName: string;
  contributorIndex: number;
  removeContributor?: () => void;
}

export const ProjectContributorRow = ({
  contributor,
  baseFieldName,
  removeContributor,
  contributorIndex,
}: ProjectContributorRowProps) => {
  const { t } = useTranslation();
  const { errors, touched, setFieldValue, setFieldTouched } = useFormikContext<SaveCristinProject>();

  const [showConfirmRemoveContributor, setShowConfirmRemoveContributor] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);

  const [personSearchResult, isLoadingPersonSearchResult] = useFetch<SearchResponse<CristinPerson>>({
    url: debouncedSearchTerm ? `${CristinApiPath.Person}?results=20&name=${debouncedSearchTerm}` : '',
  });

  const [isLoadingDefaultOptions, setIsLoadingDefaultOptions] = useState(false);
  const [defaultInstitutionOptions, setDefaultInstitutionOptions] = useState<Organization[]>([]);
  const fetchSuggestedInstitutions = async (affiliationIds: string[]) => {
    if (affiliationIds.length > 0) {
      setIsLoadingDefaultOptions(true);
    }

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

  const contributorErrors = errors.contributors?.[contributorIndex] as FormikErrors<ProjectContributor>;

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
            options={personSearchResult?.hits ?? []}
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
                isLoading={isLoadingPersonSearchResult}
                showSearchIcon={!field.value.id}
              />
            )}
          />
        )}
      </Field>
      <Field name={`${baseFieldName}.${ProjectContributorFieldName.Affiliation}`}>
        {({ field }: FieldProps<ProjectOrganization>) => (
          <OrganizationSearchField
            onChange={(institution) => {
              const selectedCoordinatingInstitution: ProjectOrganization = {
                type: 'Organization',
                id: institution?.id ?? '',
                name: institution?.name ?? {},
              };
              setFieldValue(field.name, selectedCoordinatingInstitution);
            }}
            fieldInputProps={{
              ...field,
              onBlur: () => setFieldTouched(`${field.name}.id`),
            }}
            errorMessage={
              touched.contributors?.[contributorIndex]?.affiliation?.id && !!contributorErrors?.affiliation?.id
                ? contributorErrors?.affiliation?.id
                : ''
            }
            isLoadingDefaultOptions={isLoadingDefaultOptions}
            defaultOptions={defaultInstitutionOptions.filter((institution) => institution.id !== field.value.id)}
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
