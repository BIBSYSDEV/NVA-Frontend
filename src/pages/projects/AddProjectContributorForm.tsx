import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledRightAlignedFooter } from '../../components/styled/Wrappers';
import { CristinProject, ProjectContributor, ProjectFieldName } from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getValueByKey } from '../../utils/user-helpers';

interface AddProjectContributorFormProps {
  toggleModal: () => void;
}

export const AddProjectContributorForm = ({ toggleModal }: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addContributor = () => {
    if (!selectedPerson) {
      return;
    }

    const newContributor: ProjectContributor = {
      identity: {
        type: 'Person',
        id: selectedPerson.id,
        firstName: getValueByKey('FirstName', selectedPerson.names),
        lastName: getValueByKey('LastName', selectedPerson.names),
      },
      roles: selectedPerson.affiliations.map((affiliation) => {
        return {
          type: 'ProjectParticipant',
          affiliation: { type: 'Organization', id: affiliation.organization, labels: {} },
        };
      }),
    };

    const newContributors = values.contributors ? [...values.contributors, newContributor] : [newContributor];

    setFieldValue(ProjectFieldName.Contributors, newContributors);
    toggleModal();
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
          onClick={addContributor}
          size="large"
          variant="contained">
          {t('registration.contributors.add_contributor')}
        </Button>
      </StyledRightAlignedFooter>
    </Box>
  );
};
