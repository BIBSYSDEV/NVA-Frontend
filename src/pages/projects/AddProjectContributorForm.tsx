import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledRightAlignedFooter } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/notificationSlice';
import {
  CristinProject,
  ProjectContributor,
  ProjectContributorRole,
  ProjectContributorType,
  ProjectFieldName,
} from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getValueByKey } from '../../utils/user-helpers';

const roles: ProjectContributorType[] = ['ProjectManager', 'ProjectParticipant'];

interface AddProjectContributorFormProps {
  hasProjectManager: boolean;
  toggleModal: () => void;
}

export const AddProjectContributorForm = ({ hasProjectManager, toggleModal }: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContributorRole, setSelectedContributorRole] = useState<ProjectContributorType>(
    hasProjectManager ? 'ProjectParticipant' : 'ProjectManager'
  );
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addContributor = () => {
    if (!selectedPerson || !selectedContributorRole) {
      return;
    }

    if (selectedContributorRole === 'ProjectManager' && hasProjectManager) {
      dispatch(
        setNotification({
          message: t('project.error.there_can_only_be_one_project_manager_choose_different_role'),
          variant: 'error',
        })
      );
      return;
    }

    let newContributor: ProjectContributor;

    const existingContributorIndex = contributors.findIndex(
      (contributor) => contributor.identity.id === selectedPerson.id
    );

    // If person is already added
    if (existingContributorIndex > -1) {
      // Cannot add same person with same role and affiliation
      if (
        contributors[existingContributorIndex].roles.some(
          (role) =>
            role.type === selectedContributorRole &&
            selectedPerson.affiliations.some((affiliation) => affiliation.organization === role.affiliation?.id)
        )
      ) {
        dispatch(
          setNotification({
            message: t('project.error.contributor_already_added_with_same_role_and_affiliation'),
            variant: 'error',
          })
        );
        return;
      }
      newContributor = { ...contributors[existingContributorIndex] };
    } else {
      newContributor = {
        identity: {
          type: 'Person',
          id: selectedPerson.id,
          firstName: getValueByKey('FirstName', selectedPerson.names),
          lastName: getValueByKey('LastName', selectedPerson.names),
        },
        roles: [],
      };
    }

    // Adding several affiliations
    if (selectedPerson.affiliations.length > 0) {
      newContributor.roles = [...newContributor.roles].concat(
        selectedPerson.affiliations.map((affiliation, index) => {
          return {
            type: selectedContributorRole === 'ProjectManager' && index === 0 ? 'ProjectManager' : 'ProjectParticipant', // Backend only supports one ProjectManager role per project
            affiliation: { type: 'Organization', id: affiliation.organization, labels: {} },
          } as ProjectContributorRole;
        })
      );
    } else {
      // Adding no affiliations
      newContributor.roles = [
        ...newContributor.roles,
        {
          type: selectedContributorRole === 'ProjectManager' ? 'ProjectManager' : 'ProjectParticipant',
          affiliation: undefined,
        } as ProjectContributorRole,
      ];
    }

    const newContributors = [...values.contributors];

    if (existingContributorIndex > -1) {
      newContributors[existingContributorIndex] = newContributor;
    } else {
      newContributors.push(newContributor);
    }

    setFieldValue(ProjectFieldName.Contributors, newContributors);
    toggleModal();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <TextField
        data-testid={dataTestId.projectWizard.selectContributorType}
        sx={{ maxWidth: '15rem' }}
        value={selectedContributorRole}
        onChange={(event) => {
          const role = (event.target.value as ProjectContributorType) ?? '';
          setSelectedContributorRole(role);
        }}
        fullWidth
        select
        label={t('project.form.select_project_role')}
        variant="outlined">
        {roles.map((role) => (
          <MenuItem
            key={role}
            value={role}
            disabled={hasProjectManager ? role === 'ProjectManager' : role === 'ProjectParticipant'}>
            {t(`project.role_types.${role}`)}
          </MenuItem>
        ))}
      </TextField>
      <ContributorSearchField
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <StyledRightAlignedFooter>
        <Button
          sx={{ mt: '1rem' }}
          data-testid={dataTestId.projectForm.selectContributorButton}
          disabled={!selectedPerson}
          onClick={addContributor}
          size="large"
          variant="contained">
          {t('registration.contributors.add_contributor')}
        </Button>
      </StyledRightAlignedFooter>
    </Box>
  );
};
