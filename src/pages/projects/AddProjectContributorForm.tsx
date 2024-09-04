import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
    roleToAddTo: ProjectContributorType
  ) => ProjectContributor[] | undefined;
}

export const AddProjectContributorForm = ({ toggleModal, addContributor }: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addParticipant = () => {
    const newContributors = addContributor(selectedPerson, contributors, 'ProjectParticipant');

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
      <StyledRightAlignedFooter>
        <Button
          sx={{ mt: '1rem' }}
          data-testid={dataTestId.projectForm.selectContributorButton}
          disabled={!selectedPerson}
          onClick={addParticipant}
          size="large"
          variant="contained">
          {t('registration.contributors.add_contributor')}
        </Button>
      </StyledRightAlignedFooter>
    </Box>
  );
};
