import AddIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { ContributorName } from '../../../components/ContributorName';
import { SimpleWarning } from '../../../components/messages/SimpleWarning';
import { ProjectContributor, ProjectContributorFieldName, SaveCristinProject } from '../../../types/project.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getFullName } from '../../../utils/user-helpers';
import { DeleteIconButton } from '../../messages/components/DeleteIconButton';
import {
  getRelevantContributorRoles,
  hasEmptyAffiliation,
  removeAffiliation,
} from '../../project/helpers/projectRoleHelpers';
import { AddProjectContributorModal } from '../AddProjectContributorModal';
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
  const [openVerifyContributor, setOpenVerifyContributor] = useState(false);

  const contributorErrors = errors?.contributors?.[contributorIndex] as ProjectContributor;
  const affiliationError = contributorErrors?.roles?.[0]?.affiliation?.id;
  const affiliationFieldTouched = touched?.contributors?.[contributorIndex]?.roles;
  const baseFieldRoles = `${baseFieldName}.${ProjectContributorFieldName.Roles}`;
  const roles = getRelevantContributorRoles(contributor, asProjectManager);
  const hasAtLeastOneEmptyAffiliation = roles.some((role) => hasEmptyAffiliation(role));
  const hasOnlyEmptyAffiliations = roles.every((role) => hasEmptyAffiliation(role));
  const rolesString = asProjectManager ? t('project.project_manager') : t('project.project_participant');

  const toggleAffiliationModal = () => setOpenAffiliationModal(!openAffiliationModal);
  const toggleOpenVerifyContributor = () => setOpenVerifyContributor(!openVerifyContributor);

  const onRemoveAffiliation = (affiliationId: string) => {
    const newRolesObject = removeAffiliation(affiliationId, contributor.roles, asProjectManager);

    if (newRolesObject.error) {
      return;
    }

    if (newRolesObject.newContributorRoles) {
      setFieldValue(baseFieldRoles, newRolesObject.newContributorRoles);
    }
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            alignItems: 'start',
            paddingY: '0.5rem',
          }}>
          {!contributor.identity.id && (
            <SimpleWarning
              text={
                asProjectManager
                  ? t('project.project_manager_is_unidentified')
                  : t('project.contributor_is_unidentified')
              }
            />
          )}
          <ContributorName
            id={contributor.identity.id}
            name={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
            hasVerifiedAffiliation={contributor.roles?.some((role) => role.affiliation?.id)}
            sx={{ width: '18rem' }}
          />
          {!contributor.identity.id && (
            <Button
              variant="outlined"
              sx={{ padding: '0.1rem 0.75rem' }}
              data-testid={dataTestId.projectWizard.contributorsPanel.verifyContributorButton(
                getFullName(contributor.identity.firstName, contributor.identity.lastName)
              )}
              startIcon={<SearchIcon />}
              onClick={toggleOpenVerifyContributor}>
              {asProjectManager ? t('project.verify_project_manager') : t('project.verify_contributor')}
            </Button>
          )}
        </Box>
      </TableCell>
      <TableCell>
        <Box
          sx={{
            paddingY: '0.5rem',
          }}>
          {hasOnlyEmptyAffiliations ? (
            <SimpleWarning text={t('project.no_affiliation')} />
          ) : (
            roles
              .filter((role) => role.affiliation?.id)
              .map((role) => (
                <ProjectOrganizationBox
                  key={role.affiliation!.id}
                  unitUri={role.affiliation!.id}
                  authorName={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
                  contributorRoles={contributor.roles}
                  baseFieldName={baseFieldRoles}
                  sx={{ width: '100%', marginBottom: '0.5rem' }}
                  asProjectManager={asProjectManager}
                  removeAffiliation={() => onRemoveAffiliation(role.affiliation!.id)}
                />
              ))
          )}
          {(!asProjectManager || hasAtLeastOneEmptyAffiliation) && (
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
        </Box>
      </TableCell>
      <TableCell sx={{ width: '3rem', textAlign: 'center', paddingTop: '1rem' }}>
        <DeleteIconButton
          data-testid={dataTestId.projectForm.removeContributorButton}
          onClick={() => setShowConfirmRemoveContributor(true)}
          tooltip={asProjectManager ? t('project.remove_project_manager') : t('project.form.remove_participant')}
          disabled={!removeContributor}
        />
      </TableCell>
      {/* Verify contributor */}
      <AddProjectContributorModal
        open={openVerifyContributor}
        toggleModal={toggleOpenVerifyContributor}
        initialSearchTerm={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
        indexToReplace={contributorIndex}
        addProjectManager={asProjectManager}
      />
      {/* Add Affiliation */}
      <ProjectAddAffiliationModal
        openAffiliationModal={openAffiliationModal}
        toggleAffiliationModal={toggleAffiliationModal}
        authorName={getFullName(contributor.identity.firstName, contributor.identity.lastName)}
        baseFieldName={baseFieldRoles}
        contributorRoles={contributor.roles}
        asProjectManager={asProjectManager}
      />
      {/* Confirm delete contributor */}
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
            })}
          </Typography>
        </ConfirmDialog>
      )}
    </TableRow>
  );
};
