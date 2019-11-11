import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  display: flex;
  min-height: 3rem;
  font-size: 1rem;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${({ theme }) => theme.palette.separator.main};
`;

const Footer: React.FC = () => <StyledFooter>footer</StyledFooter>;

export default Footer;
