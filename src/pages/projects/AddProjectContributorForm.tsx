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
    roleToAddTo: ProjectContributorType,
    index?: number
  ) => ProjectContributor[] | undefined;
  addUnidentifiedProjectParticipant: (
    searchTerm: string,
    role: ProjectContributorType
  ) => ProjectContributor[] | undefined;
  initialSearchTerm?: string;
  indexToReplace?: number;
}

export const AddProjectContributorForm = ({
  toggleModal,
  addContributor,
  initialSearchTerm = '',
  indexToReplace = -1,
  addUnidentifiedProjectParticipant,
}: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addParticipant = () => {
    // No change in form - nothing happens
    if (searchTerm === initialSearchTerm && !selectedPerson) {
      return;
    }

    const newContributors = addContributor(selectedPerson, contributors, 'ProjectParticipant', indexToReplace);

    if (newContributors) {
      setFieldValue(ProjectFieldName.Contributors, newContributors);
      toggleModal();
    }
  };

  const addUnidentifiedParticipant = () => {
    const newContributors = addUnidentifiedProjectParticipant(searchTerm, 'ProjectParticipant');

    if (newContributors) {
      setFieldValue(ProjectFieldName.Contributors, newContributors);
      toggleModal();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ContributorSearchField
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <StyledRightAlignedFooter sx={{ mt: '2rem' }}>
        <Box sx={{ flexGrow: '1' }}>
          <Button
            data-testid={dataTestId.projectForm.addUnidentifiedContributorButton}
            disabled={!searchTerm || searchTerm === initialSearchTerm || selectedPerson !== undefined}
            onClick={addUnidentifiedParticipant}
            size="large">
            {t('project.add_unidentified_contributor')}
          </Button>
        </Box>
        <CancelButton testId={dataTestId.projectForm.cancelAddParticipantButton} onClick={toggleModal} />
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
