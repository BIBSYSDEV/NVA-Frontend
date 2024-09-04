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

interface AddProjectManagerFormProps {
  toggleModal: () => void;
  addContributor: (
    personToAdd: CristinPerson | undefined,
    contributors: ProjectContributor[],
    roleToAddTo: ProjectContributorType
  ) => ProjectContributor[] | undefined;
}

export const AddProjectManagerForm = ({ toggleModal, addContributor }: AddProjectManagerFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addProjectManager = () => {
    const newContributors = addContributor(selectedPerson, contributors, 'ProjectManager');

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
        singleSelectAffiliations
      />
      <StyledRightAlignedFooter>
        <Button
          sx={{ mt: '1rem' }}
          data-testid={dataTestId.projectForm.addProjectManagerButton}
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
