import AddIcon from '@mui/icons-material/AddCircleOutline';
import { Autocomplete, Box, Button, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { Field, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { AutocompleteTextField } from '../../../components/AutocompleteTextField';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
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
import { getFullCristinName, getFullName, getValueByKey } from '../../../utils/user-helpers';
import { DeleteIconButton } from '../../messages/components/DeleteIconButton';
import {
  isProjectManager,
  projectContributorToCristinPerson,
} from '../../registration/description_tab/projects_field/projectHelpers';
import { ProjectAddAffiliationModal } from '../ProjectAddAffiliationModal';
import { ProjectOrganizationBox } from '../ProjectOrganizationBox';

interface ContributorRowProps {
  contributorIndex: number;
  isRekProject: boolean;
  baseFieldName: string;
  contributor: ProjectContributor;
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
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [showConfirmRemoveContributor, setShowConfirmRemoveContributor] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm);
  const personQuery = useFetchPerson(debouncedSearchTerm);
  const personSearchResult = personQuery.data?.hits ?? [];

  const isRekProjectManager = isRekProject && contributor && isProjectManager(contributor);
  const hasEmptyRole = contributor.roles.some((role) => !role.affiliation.id);
  const contributorErrors = errors?.contributors?.[contributorIndex] as ProjectContributor;
  const affiliationError = contributorErrors?.roles[0]?.affiliation.id;
  const affiliationFieldTouched = touched?.contributors?.[contributorIndex]?.roles;

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  return (
    <TableRow sx={{ td: { verticalAlign: 'top' } }}>
      <TableCell align="left" width={'1'}>
        <Box sx={{ display: 'flex', alignItems: 'end' }}>
          <Field name={`${baseFieldName}.${ProjectFieldName.RoleType}`}>
            {({ field }: FieldProps<ProjectContributorType>) => (
              <TextField
                data-testid={dataTestId.registrationWizard.description.projectForm.roleField}
                label={t('common.role')}
                sx={{ width: '10rem' }}
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
      <TableCell width={'1'}>
        <Field name={`${baseFieldName}.${ProjectContributorFieldName.Identity}`}>
          {({ field }: FieldProps<ProjectContributorIdentity>) => (
            <Autocomplete
              options={personSearchResult}
              disabled={isRekProjectManager}
              sx={{ width: '20rem' }}
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
      <TableCell>
        {!hasEmptyRole ? (
          contributor.roles.map((role) => {
            return (
              <ProjectOrganizationBox
                key={role.affiliation.id}
                unitUri={role.affiliation.id}
                authorName={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
                contributorRoles={contributor.roles}
                baseFieldName={`${baseFieldName}.${ProjectContributorFieldName.Roles}`}
                sx={{ width: '100%' }}
              />
            );
          })
        ) : (
          <>
            <Button
              variant="outlined"
              sx={{ padding: '0.1rem 0.75rem' }}
              data-testid={dataTestId.registrationWizard.contributors.addAffiliationButton}
              startIcon={<AddIcon />}
              color={affiliationFieldTouched && affiliationError ? 'error' : 'inherit'}
              onClick={toggleAffiliationModal}>
              {t('project.add_affiliation')}
            </Button>
            {affiliationFieldTouched && affiliationError && (
              <Typography sx={{ color: 'error.main', marginTop: '0.25rem', letterSpacing: '0.03333em' }}>
                {affiliationError}
              </Typography>
            )}
          </>
        )}
      </TableCell>
      <TableCell sx={{ width: '3rem', textAlign: 'center', paddingTop: '1rem' }}>
        <DeleteIconButton
          data-testid={dataTestId.registrationWizard.description.projectForm.removeContributorButton}
          onClick={() => setShowConfirmRemoveContributor(true)}
          tooltip={t('project.form.remove_participant')}
          disabled={!removeContributor}
        />
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
                  getFullName(contributor?.identity?.firstName, contributor?.identity?.lastName) ??
                  t('project.project_participant').toLocaleLowerCase(),
              })}
            </Typography>
          </ConfirmDialog>
        )}
      </TableCell>
      <ProjectAddAffiliationModal
        openAffiliationModal={openAffiliationModal}
        toggleAffiliationModal={toggleAffiliationModal}
        authorName={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
        baseFieldName={`${baseFieldName}.${ProjectContributorFieldName.Roles}`}
        contributorRoles={contributor.roles}
      />
    </TableRow>
  );
};
