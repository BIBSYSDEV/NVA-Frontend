import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  display: flex;
  min-height: 3rem;
  color: ${props => props.theme.palette.link.main};
  font-size: 1rem;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${props => props.theme.palette.seperator.main};
`;

const Footer: React.FC = () => <StyledFooter>footer</StyledFooter>;

export default Footer;
