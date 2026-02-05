import { Box } from '@mui/material';
import { useState } from 'react';
import { ContributorSearchField } from '../../../../components/ContributorSearchField';
import { ContributorRole } from '../../../../types/contributor.types';
import { ImportContributor } from '../../../../types/importCandidate.types';
import { CristinPerson } from '../../../../types/user.types';

interface CentralImportSearchForContributorProps {
  importContributor: ImportContributor;
}

export const CentralImportSearchForContributor = ({ importContributor }: CentralImportSearchForContributorProps) => {
  const [selectedPerson, setSelectedPerson] = useState<CristinPerson>();
  const searchTerm = importContributor.identity.name;

  const selectedContributorRole = importContributor.role?.type ?? ContributorRole.Other;
  const initialSearchTerm = importContributor.identity.name;

  return (
    <Box
      sx={{
        gridColumn: '3',
        border: '1px solid',
        borderRadius: '4px',
        display: 'flex',
        gap: '0.5rem',
        padding: '0.5rem',
        boxShadow: '0px 3px 3px 0px rgba(0, 0, 0, 0.30)',
        backgroundColor: 'white',
        width: '30rem',
      }}>
      <ContributorSearchField
        selectedPerson={selectedPerson}
        setSelectedPerson={setSelectedPerson}
        searchTerm={searchTerm}
        setSearchTerm={() => '2'}
      />
    </Box>
  );
};
