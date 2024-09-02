import { Box, Button } from '@mui/material';
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
  ProjectFieldName,
} from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getValueByKey } from '../../utils/user-helpers';
import { isProjectManagerRole } from '../project/helpers/projectContributorRoleHelpers';

interface AddProjectManagerFormProps {
  toggleModal: () => void;
}

export const AddProjectManagerForm = ({ toggleModal }: AddProjectManagerFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const projectManagerIndex = contributors.findIndex((c) => c.roles.some((r) => isProjectManagerRole(r)));
  const projectManager = contributors[projectManagerIndex];
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addProjectManager = () => {
    if (!selectedPerson) {
      return;
    }

    if (projectManager) {
      dispatch(
        setNotification({
          message: t('project.error.there_can_only_be_one_project_manager'),
          variant: 'error',
        })
      );
      return;
    }

    // The person chosen to be project manager might already exist in the project contributor list
    const existingContributorIndex = contributors.findIndex(
      (contributor) => contributor.identity.id === selectedPerson.id
    );

    let newContributor: ProjectContributor;

    if (existingContributorIndex > -1) {
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

    if (selectedPerson.affiliations.length === 1) {
      newContributor.roles = [
        ...newContributor.roles,
        {
          type: 'ProjectManager',
          affiliation: {
            type: 'Organization',
            id: selectedPerson.affiliations[0].organization, // We can only choose one affiliation for projectManager
          },
        } as ProjectContributorRole,
      ];
    } else {
      newContributor.roles = [
        ...newContributor.roles,
        {
          type: 'ProjectManager',
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
      <ContributorSearchField
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        addProjectManager
      />
      <StyledRightAlignedFooter>
        <Button
          sx={{ mt: '1rem' }}
          data-testid={dataTestId.projectForm.selectContributorButton}
          disabled={!selectedPerson}
          onClick={addProjectManager}
          size="large"
          variant="contained">
          {t('project.add_project_manager')}
        </Button>
      </StyledRightAlignedFooter>
    </Box>
  );
};
