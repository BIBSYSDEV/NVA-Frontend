import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CancelButton } from '../../components/buttons/CancelButton';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledRightAlignedFooter } from '../../components/styled/Wrappers';
import {
  CristinProject,
  ProjectContributor,
  ProjectContributorRole,
  ProjectContributorType,
  ProjectFieldName,
} from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';

interface AddProjectContributorFormProps {
  toggleModal: () => void;
  addContributor: (
    personToAdd: CristinPerson | undefined,
    contributors: ProjectContributor[],
    roleToAddTo: ProjectContributorType
  ) => ProjectContributor[] | undefined;
}

export const AddProjectContributorForm = ({ toggleModal, addContributor }: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();
  const [showAddUnidentifiedButton, setShowAddUnidentifiedButton] = useState(false);

  const addParticipant = () => {
    const newContributors = addContributor(selectedPerson, contributors, 'ProjectParticipant');

    if (newContributors) {
      setFieldValue(ProjectFieldName.Contributors, newContributors);
      toggleModal();
    }
  };

  const addUnidentifiedParticipant = () => {
    if (!searchTerm) {
      return;
    }

    const names = searchTerm.split(' ');
    let firstName, lastName;

    if (names.length > 1) {
      const namesWithoutLastName = names.slice(0, -1);
      firstName = namesWithoutLastName.join(' ');
      lastName = names[names.length - 1];
    } else {
      firstName = names[0];
      lastName = '';
    }

    const newContributor: ProjectContributor = {
      identity: {
        type: 'Person',
        firstName: firstName,
        lastName: lastName,
      },
      roles: [
        {
          type: 'ProjectParticipant',
          affiliation: undefined,
        } as ProjectContributorRole,
      ],
    };
    const newContributors = [...contributors];
    newContributors.push(newContributor);
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
        setShowAddUnidentifiedButton={setShowAddUnidentifiedButton}
      />
      <StyledRightAlignedFooter sx={{ mt: '2rem' }}>
        <CancelButton testId={dataTestId.projectForm.cancelAddParticipantButton} onClick={toggleModal} />
        <Button
          data-testid={dataTestId.projectForm.addUnidentifiedContributorButton}
          disabled={!showAddUnidentifiedButton}
          onClick={addUnidentifiedParticipant}
          size="large"
          variant="contained">
          {t('project.add_unidentified_contributor')}
        </Button>
        <Button
          data-testid={dataTestId.projectForm.selectContributorButton}
          disabled={!selectedPerson}
          onClick={addParticipant}
          size="large"
          variant="contained">
          {t('project.add_contributor')}
        </Button>
      </StyledRightAlignedFooter>
    </Box>
  );
};
