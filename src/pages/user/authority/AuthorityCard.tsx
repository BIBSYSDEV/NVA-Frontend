import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Box from '../../../components/Box';
import { Marc21Codes, Marc21Subcodes, Authority } from '../../../types/authority.types';
import { AlmaPublication } from '../../../types/resource.types';
import { useDispatch } from 'react-redux';
import { getPublications } from '../../../api/external/almaApi';
import { Radio } from '@material-ui/core';

const StyledBoxContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2rem;
`;

interface AuthorityCardProps {
  authority: Authority;
  isSelected: boolean;
}

const AuthorityCard: React.FC<AuthorityCardProps> = ({ authority, isSelected }) => {
  const [publications, setPublications] = useState<AlmaPublication[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAuthorities = async () => {
      const retrievedPublications = await getPublications(authority.systemControlNumber, dispatch);
      setPublications(retrievedPublications);
    };

    fetchAuthorities();
  }, [dispatch, authority.systemControlNumber]);

  const authorityMarcdata = authority.marcdata || [];
  const authorityNameField =
    authorityMarcdata.find(field => Marc21Codes.PERSONAL_NAME === field.tag) ||
    authorityMarcdata.find(field => Marc21Codes.HEADING_PERSONAL_NAME === field.tag);
  const authorityName =
    authorityNameField && authorityNameField.subfields.find(subfield => subfield.subcode === Marc21Subcodes.NAME);

  return (
    <Box>
      <StyledBoxContent>
        <div>
          <Radio color="primary" checked={isSelected} />
          {authorityName && authorityName.value}
        </div>
        <div>{publications.length ? publications[0].title : null}</div>
      </StyledBoxContent>
    </Box>
  );
};

export default AuthorityCard;
