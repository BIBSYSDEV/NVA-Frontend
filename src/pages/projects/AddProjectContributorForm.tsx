import { Box, Button } from '@mui/material';
import { useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContributorSearchField } from '../../components/ContributorSearchField';
import { StyledRightAlignedFooter } from '../../components/styled/Wrappers';
import {
  CristinProject,
  ProjectContributor,
  ProjectContributorRole,
  ProjectFieldName,
} from '../../types/project.types';
import { CristinPerson } from '../../types/user.types';
import { dataTestId } from '../../utils/dataTestIds';
import { getValueByKey } from '../../utils/user-helpers';

interface AddProjectContributorFormProps {
  toggleModal: () => void;
}

export const AddProjectContributorForm = ({ toggleModal }: AddProjectContributorFormProps) => {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext<CristinProject>();
  const { contributors } = values;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();

  const addContributor = () => {
    if (!selectedPerson) {
      return;
    }

    // The person might already exist as a project manager
    const existingContributorIndex = contributors.findIndex(
      (contributor) => contributor.identity.id === selectedPerson.id
    );

    let newContributor: ProjectContributor;

    if (existingContributorIndex > -1) {
      newContributor = { ...contributors[existingContributorIndex] };
    } else {
      newContributor = {
        identity: {
          type: 'Person',
          id: selectedPerson.id,
          firstName: getValueByKey('FirstName', selectedPerson.names),
          lastName: getValueByKey('LastName', selectedPerson.names),
        },
        roles: [],
      };
    }

    // Adding a new role with several affiliations
    if (selectedPerson.affiliations.length > 0) {
      newContributor.roles = [...newContributor.roles].concat(
        selectedPerson.affiliations.map((affiliation) => {
          return {
            type: 'ProjectParticipant',
            affiliation: { type: 'Organization', id: affiliation.organization, labels: {} },
          };
        })
      );
    } else {
      // Adding a new role without any affiliations
      newContributor.roles = [
        ...newContributor.roles,
        {
          type: 'ProjectParticipant',
          affiliation: undefined,
        } as ProjectContributorRole,
      ];
    }

    const newContributors = [...values.contributors];

    if (existingContributorIndex > -1) {
      newContributors[existingContributorIndex] = newContributor;
    } else {
      newContributors.push(newContributor);
    }

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
