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
import { ProjectAddAffiliationModal } from '../ProjectAddAffiliationModal';
import { ProjectOrganizationBox } from '../ProjectOrganizationBox';

interface ContributorRowProps {
  contributorIndex: number;
  baseFieldName: string;
  contributor: ProjectContributor;
  removeContributor?: () => void;
  isProjectManager?: boolean;
}

export const ContributorRow = ({
  contributorIndex,
  baseFieldName,
  contributor,
  removeContributor,
  isProjectManager = false,
}: ContributorRowProps) => {
  const { t } = useTranslation();
  const { errors, touched, setFieldValue } = useFormikContext<SaveCristinProject>();
  const [openAffiliationModal, setOpenAffiliationModal] = useState(false);
  const [showConfirmRemoveContributor, setShowConfirmRemoveContributor] = useState(false);

  const contributorErrors = errors?.contributors?.[contributorIndex] as ProjectContributor;
  const affiliationError = contributorErrors?.roles?.[0]?.affiliation?.id;
  const affiliationFieldTouched = touched?.contributors?.[contributorIndex]?.roles;
  const baseFieldRoles = `${baseFieldName}.${ProjectContributorFieldName.Roles}`;
  const rolesString = isProjectManager ? t('project.project_manager') : t('project.project_contributor');

  const hasEmptyAffiliation = contributor.roles.some((r) => r.affiliation === undefined);

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);

  const removeAffiliation = (affiliationId: string) => {
    const roleToRemoveIndex = contributor.roles.findIndex((role) => role.affiliation?.id === affiliationId);
    const newRoles = [...contributor.roles];
    newRoles.splice(roleToRemoveIndex, 1);

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
          {contributor.roles
            .filter((r) => (isProjectManager ? r.type === 'ProjectManager' : r.type !== 'ProjectManager'))
            .filter((r) => r.affiliation && r.affiliation.id)
            .map((role) => (
              <ProjectOrganizationBox
                key={role.affiliation!.id}
                unitUri={role.affiliation!.id}
                authorName={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
                contributorRoles={contributor.roles}
                baseFieldName={baseFieldRoles}
                sx={{ width: '100%', marginBottom: '0.5rem' }}
                removeAffiliation={
                  contributor.roles.length === 1 ? undefined : () => removeAffiliation(role.affiliation!.id)
                }
                disabledTooltip={
                  contributor.roles.length === 1 ? t('project.affiliation_modal.cannot_delete_only_affiliation') : ''
                }
                showDeleteButton={role.type !== 'ProjectManager' && contributor.roles.length > 1}
              />
            ))}
          {(!isProjectManager || hasEmptyAffiliation) && (
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
          data-testid={dataTestId.registrationWizard.description.projectForm.removeContributorButton}
          onClick={() => setShowConfirmRemoveContributor(true)}
          tooltip={isProjectManager ? t('project.form.remove_project_manager') : t('project.form.remove_participant')}
          disabled={!removeContributor}
        />
        {!!removeContributor && (
          <ConfirmDialog
            open={showConfirmRemoveContributor}
            onAccept={() => {
              removeContributor();
              setShowConfirmRemoveContributor(false);
            }}
            title={isProjectManager ? t('project.form.remove_project_manager') : t('project.form.remove_participant')}
            onCancel={() => setShowConfirmRemoveContributor(false)}>
            <Typography>
              {t('project.form.remove_participant_text', {
                name:
                  getFullName(contributor?.identity?.firstName, contributor?.identity?.lastName) ??
                  t('project.project_participant').toLocaleLowerCase(),
                as: isProjectManager ? ` ${t('project.as_project_manager')}` : '',
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
      />
    </TableRow>
  );
};
