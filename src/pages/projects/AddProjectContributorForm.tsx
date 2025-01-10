import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useAddSelfAsContributor } from '../../api/hooks/useAddSelfAsContributor';
import { CancelButton } from '../../components/buttons/CancelButton';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledContributorModalActions } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { CristinProject, ProjectContributorType, ProjectFieldName } from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import {
  addContributor,
  AddContributorErrors,
  addUnidentifiedProjectContributor,
} from '../project/helpers/projectContributorHelpers';

interface AddProjectContributorFormProps {
  toggleModal: () => void;
  roleType: ProjectContributorType;
  initialSearchTerm?: string;
  indexToReplace?: number;
}

export const AddProjectContributorForm = ({
  toggleModal,
  roleType,
  initialSearchTerm = '',
  indexToReplace = -1,
}: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();
  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId ?? '';

  const addParticipant = (person: CristinPerson) => {
    const { newContributors, error } = addContributor(person, contributors, roleType, indexToReplace);

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
    const { newContributors, error } = addUnidentifiedProjectContributor(
      searchTerm,
      contributors,
      roleType,
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

  const addSelfAsContributor = useAddSelfAsContributor({
    cristinId: userCristinId,
    addContributorFn: addParticipant,
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ContributorSearchField
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <StyledContributorModalActions>
        <Button
          data-testid={dataTestId.projectForm.addUnidentifiedContributorButton}
          disabled={!searchTerm || searchTerm === initialSearchTerm || selectedPerson !== undefined}
          onClick={addUnidentifiedParticipant}
          variant="outlined">
          {t('project.add_unidentified_contributor')}
        </Button>
        <LoadingButton
          data-testid={dataTestId.projectForm.addSelfAsProjectParticipantButton}
          onClick={addSelfAsContributor.addSelf}
          disabled={!!selectedPerson}
          variant="outlined"
          loading={addSelfAsContributor.isFetching}>
          {t('project.add_self')}
        </LoadingButton>
        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            flexDirection: { xs: 'column', md: 'row', alignItems: 'center' },
          }}>
          <CancelButton testId={dataTestId.projectForm.cancelAddParticipantButton} onClick={toggleModal} />
          <Button
            fullWidth
            data-testid={dataTestId.projectForm.selectContributorButton}
            disabled={!selectedPerson}
            onClick={() => selectedPerson && addParticipant(selectedPerson)}
            variant="outlined">
            {roleType === 'LocalProjectManager' ? t('project.add_local_manager') : t('project.add_contributor')}
          </Button>
        </Box>
      </StyledContributorModalActions>
    </Box>
  );
};
