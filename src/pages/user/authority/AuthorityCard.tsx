import React from 'react';
import styled from 'styled-components';

import Box from '../../../components/Box';
import { Marc21Codes, Authority } from '../../../types/authority.types';

const StyledBoxContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr;
  column-gap: 2rem;
`;

interface AuthorityCardProps {
  authority: Authority;
}

const AuthorityCard: React.FC<AuthorityCardProps> = ({ authority }) => {
  const authorityMarcdata = authority.marcdata || [];

  const authorityNameField =
    authorityMarcdata.find(field => Marc21Codes.PERSONAL_NAME === field.tag) ||
    authorityMarcdata.find(field => Marc21Codes.HEADING_PERSONAL_NAME === field.tag);
  const authorityName = authorityNameField && authorityNameField.subfields.find(subfield => subfield.subcode === 'a');

  return (
    <Box>
      <StyledBoxContent>
        <div>{authorityName && authorityName.value}</div>
        <div>[Siste publikasjon]</div>
      </StyledBoxContent>
    </Box>
  );
};

export default AuthorityCard;
