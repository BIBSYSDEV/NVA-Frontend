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
  ProjectContributorType,
  ProjectFieldName,
} from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';

const roles: ProjectContributorType[] = ['ProjectManager', 'ProjectParticipant'];

interface AddProjectContributorFormProps {
  hasProjectManager: boolean;
  toggleModal: () => void;
}

export const AddProjectContributorForm = ({ hasProjectManager, toggleModal }: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContributorRole, setSelectedContributorRole] = useState(hasProjectManager ? roles[1] : roles[0]);
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
    }

    const newContributor: ProjectContributor = {
      identity: {
        type: 'Person',
        id: selectedPerson.id,
        firstName: selectedPerson.names[0].type === 'FirstName' ? selectedPerson.names[0].value : '',
        lastName: selectedPerson.names[1].type === 'LastName' ? selectedPerson.names[1].value : '',
      },
      roles: selectedPerson.affiliations.map((affiliation, index) => {
        return {
          type: selectedContributorRole === 'ProjectManager' && index === 0 ? 'ProjectManager' : 'ProjectParticipant', // Backend only supports one ProjectManager role per project
          affiliation: { type: 'Organization', id: affiliation.organization, labels: {} },
        };
      }),
    };

    const newContributors = values.contributors ? [...values.contributors] : [];
    newContributors.push(newContributor);

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
          <MenuItem key={role} value={role} disabled={role === 'ProjectManager' && hasProjectManager}>
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
