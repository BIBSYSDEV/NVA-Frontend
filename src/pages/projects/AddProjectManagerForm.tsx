import { Box, Button, Typography } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { CancelButton } from '../../components/buttons/CancelButton';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledRightAlignedFooter } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/notificationSlice';
import { CristinProject, ProjectFieldName } from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import {
  addContributor,
  AddContributorErrors,
  addUnidentifiedProjectContributor,
} from '../project/helpers/projectContributorHelpers';
import { contributorHasNonEmptyAffiliation } from '../project/helpers/projectRoleHelpers';
import { SelectAffiliations } from '../registration/contributors_tab/components/AddContributorTableRow';

interface AddProjectManagerFormProps {
  toggleModal: () => void;
  suggestedProjectManager?: string;
  initialSearchTerm?: string;
  indexToReplace?: number;
}

export const AddProjectManagerForm = ({
  toggleModal,
  suggestedProjectManager,
  initialSearchTerm = '',
  indexToReplace = -1,
}: AddProjectManagerFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const contributorToReplace = indexToReplace > -1 ? contributors[indexToReplace] : undefined;
  const hasAffiliation = contributorToReplace && contributorHasNonEmptyAffiliation(contributorToReplace.roles);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addProjectManager = () => {
    const { newContributors, error } = addContributor(selectedPerson, contributors, 'ProjectManager');

    if (error === AddContributorErrors.SAME_ROLE_WITH_SAME_AFFILIATION) {
      dispatch(
        setNotification({
          message: t('project.error.contributor_already_added_with_same_role_and_affiliation'),
          variant: 'error',
        })
      );
      return;
    }

    if (newContributors) {
      setFieldValue(ProjectFieldName.Contributors, newContributors);
      toggleModal();
    }
  };

  const addUnidentifiedManager = () => {
    const { newContributors, error } = addUnidentifiedProjectContributor(
      searchTerm,
      contributors,
      'ProjectManager',
      indexToReplace
    );

    if (error === AddContributorErrors.NO_SEARCH_TERM) {
      return;
    }

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
