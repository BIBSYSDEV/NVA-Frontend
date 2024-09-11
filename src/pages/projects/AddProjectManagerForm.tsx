import { Box, Button, Typography } from '@mui/material';
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
import { contributorHasNonEmptyAffiliation } from '../project/helpers/projectRoleHelpers';
import { SelectAffiliations } from '../registration/contributors_tab/components/AddContributorTableRow';

interface AddProjectManagerFormProps {
  toggleModal: () => void;
  addContributor: (
    personToAdd: CristinPerson | undefined,
    contributors: ProjectContributor[],
    roleToAddTo: ProjectContributorType,
    index?: number
  ) => ProjectContributor[] | undefined;
  addUnidentifiedProjectParticipant: (
    searchTerm: string,
    role: ProjectContributorType,
    indexToReplace: number
  ) => ProjectContributor[] | undefined;
  suggestedProjectManager?: string;
  initialSearchTerm?: string;
  indexToReplace?: number;
}

export const AddProjectManagerForm = ({
  toggleModal,
  addContributor,
  suggestedProjectManager,
  initialSearchTerm = '',
  indexToReplace = -1,
  addUnidentifiedProjectParticipant,
}: AddProjectManagerFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const contributorToReplace = indexToReplace > -1 ? contributors[indexToReplace] : undefined;
  const hasAffiliation = contributorToReplace && contributorHasNonEmptyAffiliation(contributorToReplace.roles);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addProjectManager = () => {
    const newContributors = addContributor(selectedPerson, contributors, 'ProjectManager', indexToReplace);

    if (newContributors) {
      setFieldValue(ProjectFieldName.Contributors, newContributors);
      toggleModal();
    }
  };

  const addUnidentifiedManager = () => {
    const newContributors = addUnidentifiedProjectParticipant(searchTerm, 'ProjectManager', indexToReplace);

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
        selectAffiliations={hasAffiliation ? SelectAffiliations.NO_SELECT : SelectAffiliations.SINGLE}
      />
      <StyledRightAlignedFooter sx={{ mt: '2rem' }}>
        <Box sx={{ flexGrow: '1' }}>
          <Button
            data-testid={dataTestId.projectForm.addUnidentifiedProjectManagerButton}
            disabled={!searchTerm || searchTerm === initialSearchTerm || selectedPerson !== undefined}
            onClick={addUnidentifiedManager}
            size="large">
            {t('project.add_unidentified_project_manager')}
          </Button>
        </Box>
        <CancelButton testId={dataTestId.projectForm.cancelAddParticipantButton} onClick={toggleModal} />
        <Button
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
