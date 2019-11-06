import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLogo = styled.div`
  ${({ theme }) => `
    color: ${theme.palette.text.secondary};
    font-size: 2rem;
    grid-area: logo;
    `}
`;

const Logo: React.FC = () => (
  <Link to="/">
    <StyledLogo>NVA</StyledLogo>
  </Link>
);

export default Logo;
