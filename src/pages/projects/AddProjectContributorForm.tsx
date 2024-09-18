import { Box, Button } from '@mui/material';
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
  addUnidentifiedProjectParticipant,
} from '../project/helpers/projectContributorHelpers';

interface AddProjectContributorFormProps {
  toggleModal: () => void;
  initialSearchTerm?: string;
  indexToReplace?: number;
}

export const AddProjectContributorForm = ({
  toggleModal,
  initialSearchTerm = '',
  indexToReplace = -1,
}: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addParticipant = () => {
    const { newContributors, error } = addContributor(selectedPerson, contributors, 'ProjectParticipant');

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

  const addUnidentifiedParticipant = () => {
    const { newContributors, error } = addUnidentifiedProjectParticipant(
      searchTerm,
      contributors,
      'ProjectParticipant',
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
