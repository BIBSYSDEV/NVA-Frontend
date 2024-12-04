import { LoadingButton } from '@mui/lab';
import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerson } from '../../api/cristinApi';
import { CancelButton } from '../../components/buttons/CancelButton';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledRightAlignedFooter } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/notificationSlice';
import { RootState } from '../../redux/store';
import { CristinProject, ProjectFieldName } from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getFullCristinName } from '../../utils/user-helpers';
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
  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId ?? '';

  const {
    data: currentUser,
    isFetching,
    refetch: refetchCurrentUser,
  } = useQuery({
    enabled: false,
    queryKey: ['currentUser', userCristinId],
    queryFn: async () => {
      const data = await fetchPerson(userCristinId);
      addSelfAsProjectManager(data);
    },
    meta: { errorMessage: t('feedback.error.add_contributor') },
  });

  const addProjectManager = (person: CristinPerson) => {
    const { newContributors, error } = addContributor(person, contributors, 'ProjectManager', indexToReplace);

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

  const addSelfAsProjectManager = (person: CristinPerson) => {
    if (person) {
      if (person.affiliations.length > 1) {
        setSearchTerm(getFullCristinName(person.names));
      } else {
        addProjectManager(person);
        toggleModal();
      }
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
        <Button
          sx={{ mr: 'auto' }}
          data-testid={dataTestId.projectForm.addUnidentifiedProjectManagerButton}
          disabled={!searchTerm || searchTerm === initialSearchTerm || selectedPerson !== undefined}
          onClick={addUnidentifiedManager}
          size="large">
          {t('project.add_unidentified_project_manager')}
        </Button>
        <LoadingButton
          data-testid={dataTestId.projectForm.addSelfAsProjectManagerButton}
          onClick={() => {
            refetchCurrentUser();
          }}
          disabled={!!selectedPerson}
          loading={isFetching}>
          {t('project.add_self_as_project_manager')}
        </LoadingButton>
        <CancelButton testId={dataTestId.projectForm.cancelAddParticipantButton} onClick={toggleModal} />
        <Button
          data-testid={dataTestId.projectForm.addProjectManagerButton}
          disabled={!selectedPerson}
          onClick={() => selectedPerson && addProjectManager(selectedPerson)}
          size="large"
          variant="contained">
          {t('project.add_project_manager')}
        </Button>
      </StyledRightAlignedFooter>
    </Box>
  );
};
