import { Box, Button, Typography } from '@mui/material';
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
  suggestedProjectManager?: string;
}

export const AddProjectManagerForm = ({
  toggleModal,
  addContributor,
  suggestedProjectManager,
}: AddProjectManagerFormProps) => {
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
      {suggestedProjectManager && (
        <Typography sx={{ marginBottom: '1rem' }}>
          {t('project.project_manager_from_nfr', { name: suggestedProjectManager })}
        </Typography>
      )}
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
