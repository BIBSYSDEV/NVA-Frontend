import AddIcon from '@mui/icons-material/AddCircleOutline';
import { Button, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ContributorName } from '../../../components/ContributorName';
import { ProjectContributor, ProjectContributorFieldName, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFullName } from '../../../utils/user-helpers';
import { DeleteIconButton } from '../../messages/components/DeleteIconButton';
import {
  contributorHasEmptyAffiliation,
  findRoleIndexForAffiliation,
  getRelevantContributorRoles,
  notLastOfItsRoleType,
} from '../../project/helpers/projectRoleHelpers';
import { ProjectAddAffiliationModal } from '../ProjectAddAffiliationModal';
import { ProjectOrganizationBox } from '../ProjectOrganizationBox';

interface ContributorRowProps {
  contributorIndex: number;
  baseFieldName: string;
  contributor: ProjectContributor;
  removeContributor?: () => void;
  asProjectManager?: boolean;
}

export const ContributorRow = ({
  contributorIndex,
  baseFieldName,
  contributor,
  removeContributor,
  asProjectManager = false,
}: ContributorRowProps) => {
  const { t } = useTranslation();
  const { errors, touched, setFieldValue } = useFormikContext<SaveCristinProject>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [showConfirmRemoveContributor, setShowConfirmRemoveContributor] = useState(false);

  const contributorErrors = errors?.contributors?.[contributorIndex] as ProjectContributor;
  const affiliationError = contributorErrors?.roles?.[0]?.affiliation?.id;
  const affiliationFieldTouched = touched?.contributors?.[contributorIndex]?.roles;
  const baseFieldRoles = `${baseFieldName}.${ProjectContributorFieldName.Roles}`;
  const roles = getRelevantContributorRoles(contributor, asProjectManager);
  const hasEmptyAffiliation = contributorHasEmptyAffiliation(roles);
  const rolesString = asProjectManager ? t('project.project_manager') : t('project.project_participant');

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const removeAffiliation = (affiliationId: string) => {
    const indexOfRoleThatHasAffiliation = findRoleIndexForAffiliation(asProjectManager, contributor, affiliationId);
    const roleToDelete = contributor.roles[indexOfRoleThatHasAffiliation];
    const notLastOfItsType = notLastOfItsRoleType(contributor, affiliationId, roleToDelete.type);
    const newRoles = [...contributor.roles];

    // If it's not the last role it's unproblematic to remove the whole role
    if (notLastOfItsType) {
      newRoles.splice(indexOfRoleThatHasAffiliation, 1);
    } else {
      // Since we're just supposed to remove the affiliation and not the whole role/user row, we have to keep the last role of its type
      const newRole = { ...roleToDelete };
      newRole.affiliation = undefined;
      newRoles[indexOfRoleThatHasAffiliation] = newRole;
    }
    setFieldValue(baseFieldRoles, newRoles);
  };

  return (
    <TableRow sx={{ td: { verticalAlign: 'top' } }}>
      <TableCell align="left" width={'1'}>
        <TextField
          data-testid={dataTestId.registrationWizard.description.projectForm.roleField}
          label={t('common.role')}
          sx={{ width: '10rem' }}
          value={rolesString}
          disabled
          fullWidth
          variant="filled"
        />
      </TableCell>
      <TableCell width={'1'}>
        <ContributorName
          id={contributor.identity.id}
          name={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
          hasVerifiedAffiliation={contributor.roles?.some((role) => role.affiliation?.type === 'Organization')}
          sx={{ width: '15rem', marginTop: '0.5rem' }}
        />
      </TableCell>
      <TableCell>
        <>
          {roles
            .filter((role) => role.affiliation && role.affiliation.id)
            .map((role) => (
              <ProjectOrganizationBox
                key={role.affiliation!.id}
                unitUri={role.affiliation!.id}
                authorName={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
                contributorRoles={contributor.roles}
                baseFieldName={baseFieldRoles}
                sx={{ width: '100%', marginBottom: '0.5rem' }}
                asProjectManager={asProjectManager}
                removeAffiliation={() => removeAffiliation(role.affiliation!.id)}
              />
            ))}
          {(!asProjectManager || hasEmptyAffiliation) && (
            <Button
              variant="outlined"
              sx={{ padding: '0.1rem 0.75rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}
              data-testid={dataTestId.projectForm.addAffiliationButton}
              startIcon={<AddIcon />}
              color={affiliationFieldTouched && affiliationError ? 'error' : 'inherit'}
              onClick={toggleAffiliationModal}>
              {t('project.add_affiliation')}
            </Button>
          )}
          {affiliationFieldTouched && affiliationError && (
            <Typography sx={{ color: 'error.main', marginTop: '0.25rem', letterSpacing: '0.03333em' }}>
              {affiliationError}
            </Typography>
          )}
        </>
      </TableCell>
      <TableCell sx={{ width: '3rem', textAlign: 'center', paddingTop: '1rem' }}>
        <DeleteIconButton
          data-testid={dataTestId.projectForm.removeContributorButton}
          onClick={() => setShowConfirmRemoveContributor(true)}
          tooltip={asProjectManager ? t('project.remove_project_manager') : t('project.form.remove_participant')}
          disabled={!removeContributor}
        />
        {!!removeContributor && (
          <ConfirmDialog
            open={showConfirmRemoveContributor}
            onAccept={() => {
              removeContributor();
              setShowConfirmRemoveContributor(false);
            }}
            title={asProjectManager ? t('project.remove_project_manager') : t('project.form.remove_participant')}
            onCancel={() => setShowConfirmRemoveContributor(false)}>
            <Typography>
              {t('project.form.remove_participant_text', {
                name:
                  getFullName(contributor?.identity?.firstName, contributor?.identity?.lastName) ??
                  t('project.project_participant').toLocaleLowerCase(),
                as: asProjectManager ? ` ${t('project.as_project_manager')}` : '',
              })}
            </Typography>
          </ConfirmDialog>
        )}
      </TableCell>
      <ProjectAddAffiliationModal
        openAffiliationModal={openAffiliationModal}
        toggleAffiliationModal={toggleAffiliationModal}
        authorName={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
        baseFieldName={baseFieldRoles}
        contributorRoles={contributor.roles}
        asProjectManager={asProjectManager}
      />
    </TableRow>
  );
};
