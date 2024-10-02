import { Box, Button, MenuItem, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { CancelButton } from '../../components/buttons/CancelButton';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledRightAlignedFooter } from '../../components/styled/Wrappers';
import { setNotification } from '../../redux/notificationSlice';
import { CristinProject, ProjectContributorType, ProjectFieldName } from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import {
  addContributor,
  AddContributorErrors,
  addUnidentifiedProjectContributor,
} from '../project/helpers/projectContributorHelpers';
import { nonProjectManagerRoles } from '../project/project_wizard/ProjectContributorsForm';

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
  const [selectedContributorRole, setSelectedContributorRole] = useState<ProjectContributorType>('ProjectParticipant');

  console.log('values', values);
  console.log('selectedContributorRole', selectedContributorRole);

  const addParticipant = () => {
    const { newContributors, error } = addContributor(
      selectedPerson,
      contributors,
      selectedContributorRole,
      indexToReplace
    );

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
      <TextField
        data-testid={dataTestId.projectWizard.selectContributorType}
        sx={{ maxWidth: '15rem' }}
        value={selectedContributorRole}
        onChange={(event) => {
          const role = (event.target.value as ProjectContributorType) ?? '';
          setSelectedContributorRole(role);
        }}
        fullWidth
        select
        label={t('project.select_project_role')}
        variant="outlined">
        {nonProjectManagerRoles.map((role) => (
          <MenuItem key={role} value={role}>
            {t(`project.role_types.${role}`)}
          </MenuItem>
        ))}
      </TextField>
      <ContributorSearchField
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <StyledRightAlignedFooter sx={{ mt: '2rem' }}>
        <BetaFunctionality>
          <Button
            sx={{ mr: 'auto' }}
            data-testid={dataTestId.projectForm.addUnidentifiedContributorButton}
            disabled={!searchTerm || searchTerm === initialSearchTerm || selectedPerson !== undefined}
            onClick={addUnidentifiedParticipant}
            size="large">
            {t('project.add_unidentified_contributor')}
          </Button>
        </BetaFunctionality>
        <CancelButton testId={dataTestId.projectForm.cancelAddParticipantButton} onClick={toggleModal} />
        <Button
          data-testid={dataTestId.projectForm.selectContributorButton}
          disabled={!selectedPerson}
          onClick={addParticipant}
          size="large"
          variant="contained">
          {t('project.add_member')}
        </Button>
      </StyledRightAlignedFooter>
    </Box>
  );
};
