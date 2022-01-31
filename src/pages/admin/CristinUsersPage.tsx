import { Box, TextField, Button, CircularProgress, Typography } from '@mui/material';
import { useState } from 'react';
import { authenticatedApiRequest } from '../../api/apiRequest';
import { BetaFunctionality } from '../../components/BetaFunctionality';
import { PageHeader } from '../../components/PageHeader';
import { SyledPageContent } from '../../components/styled/Wrappers';
import { SearchResponse } from '../../types/common.types';
import { useFetch } from '../../utils/hooks/useFetch';
import { CristinUserForm } from './CristinUserForm';

interface CristinAffiliation {
  active: boolean;
  organization: string;
  role: any;
}

interface CristinIdentifier {
  type: 'CristinIdentifier' | 'NationalIdentificationNumber';
  value: string;
}

interface CristinName {
  type: 'FirstName' | 'LastName';
  value: string;
}

interface CristinArrayValue {
  type: string;
  value: string;
}

export interface CristinUser {
  id: string;
  affiliations: CristinAffiliation[];
  identifiers: CristinIdentifier[];
  names: CristinName[];
}

const getValueByKey = (key: string, items: CristinArrayValue[]) => {
  return items.find((item) => item.type === key)?.value;
};

const CristinUsersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPath, setSearchPath] = useState('');
  const [nationalNumber, setNationalNumber] = useState('');

  const [searchByNameResults, isLoadingSearchByName] = useFetch<SearchResponse<CristinUser>>({
    url: searchPath,
  });

  const searchByNationalId = async () => {
    const searchResponse = await authenticatedApiRequest<CristinUser>({
      url: '/cristin/person/identityNumber',
      method: 'POST',
      data: {
        type: 'NationalIdentificationNumber',
        value: nationalNumber,
      },
    });

    console.log(searchResponse.data);
  };

  return (
    <SyledPageContent>
      <BetaFunctionality>
        <PageHeader>Brukere</PageHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <TextField label="Søk på navn" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          <Button variant="outlined" onClick={() => setSearchPath(`/cristin/person?query=${searchTerm}`)}>
            Søk
          </Button>
          <TextField
            label="Søk på personnummer"
            value={nationalNumber}
            onChange={(event) => setNationalNumber(event.target.value)}
          />
          <Button variant="outlined" onClick={searchByNationalId}>
            Søk
          </Button>
        </Box>
        <Box>
          {isLoadingSearchByName ? (
            <CircularProgress />
          ) : (
            searchByNameResults?.hits.map((person) => (
              <p key={person.id}>
                {getValueByKey('FirstName', person.names)} {getValueByKey('LastName', person.names)}
              </p>
            ))
          )}
        </Box>
        <hr />
        <Typography variant="h2">Opprett ny bruker</Typography>
        <CristinUserForm />
      </BetaFunctionality>
    </SyledPageContent>
  );
};

export default CristinUsersPage;
