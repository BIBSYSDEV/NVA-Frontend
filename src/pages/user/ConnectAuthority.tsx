import React, { useState, useEffect } from 'react';
import { getAuthorities } from '../../api/authority/authorityRegisterApi';
import { getViafData } from '../../api/authority/viafApi';
import { useSelector } from 'react-redux';
import { RootStore } from '../../redux/reducers/rootReducer';
import Box from '../../components/Box';
import styled from 'styled-components';
import { Button } from '@material-ui/core';

const StyledAuthority = styled.div`
  margin-top: 5rem;
`;

const StyledBoxContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2rem;
`;

const StyledAuthorityContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

// Info about Marc 21 Format: https://www.loc.gov/marc/authority/
enum Marc21Codes {
  HEADING_PERSONAL_NAME = '100',
  PERSONAL_NAME = '400',
}

interface Subfield {
  subcode: string;
  value: string;
}

interface Marcdata {
  tag: Marc21Codes;
  subfields: any[];
}

interface Authority {
  systemControlNumber: string;
  marcdata: Marcdata[];
  // createdDate: Date;
  identifiersMap: any;
  publications?: any[];
}

export const ConnectAuthority: React.FC = () => {
  const [matchingAuthorities, setMatchingAuthorities] = useState<Authority[]>([]);
  const user = useSelector((store: RootStore) => store.user);
  const nameSearch = 'møkkelgjerd';

  useEffect(() => {
    const fetchAuthorities = async () => {
      const retrievedAuthorities = await getAuthorities(nameSearch);

      let updated = 0;
      retrievedAuthorities.forEach(async (authority: Authority) => {
        // Find all unique VIAF IDs
        const viafIds: string[] = Array.from(
          new Set(
            authority.identifiersMap.viaf.map((viaf: any) => {
              // VIAF value can be of format <id> or http://viaf.org/viaf/<id>
              if (parseInt(viaf)) {
                return viaf;
              } else {
                return viaf.split('/').pop();
              }
            })
          )
        );

        // TODO: Retrieve data from all VIAF IDs
        const viafData = await getViafData(viafIds[0]);
        const viafWork = viafData.titles.work;
        const viafWorkArray = !Array.isArray(viafWork) ? [viafWork] : viafWork;

        authority.publications = viafWorkArray;

        updated++;
        if (updated === retrievedAuthorities.length) {
          setMatchingAuthorities(retrievedAuthorities);
        }
      });
    };

    if (user.name) {
      fetchAuthorities();
    }
  }, [user.name]);

  return (
    <StyledAuthorityContainer>
      {matchingAuthorities.length} treff på "{nameSearch}"
      {matchingAuthorities.map(authority => (
        <AuthorityCard key={authority.systemControlNumber} authority={authority} />
      ))}
    </StyledAuthorityContainer>
  );
};

interface AuthorityCardProps {
  authority: Authority;
}

const AuthorityCard: React.FC<AuthorityCardProps> = ({ authority }) => {
  const authorityMarcdata = authority.marcdata || [];

  const authorityNameField = authorityMarcdata.find(field =>
    [Marc21Codes.PERSONAL_NAME, Marc21Codes.HEADING_PERSONAL_NAME].includes(field.tag)
  );
  const authorityName =
    authorityNameField && authorityNameField.subfields.find((subfield: Subfield) => subfield.subcode === 'a').value;
  const authorityViaf = authority.identifiersMap['viaf'][0];
  const authorityPublications = authority.publications || [];

  return (
    <StyledAuthority>
      <Box>
        <StyledBoxContent>
          <div>
            {authorityName}
            <br></br>
            <a href={authorityViaf}>Se VIAF </a>
            <Button color="primary" variant="contained">
              Se mer
            </Button>
          </div>
          <div>
            {authorityPublications.length} publikasjoner: <br />
            {authorityPublications[0].title} <br />
          </div>
        </StyledBoxContent>
      </Box>
    </StyledAuthority>
  );
};
