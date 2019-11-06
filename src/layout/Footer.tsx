import React from 'react';
import styled from 'styled-components';

import { LINE_COLOR, LINK_COLOR } from '../themes/mainTheme';

const StyledFooter = styled.div`
  display: flex;
  min-height: 3rem;
  color: ${LINK_COLOR};
  font-size: 1rem;
  font-weight: bold;
  justify-content: center;
  align-items: center;
  border-top: 2px solid ${LINE_COLOR};
`;

const Footer: React.FC = () => {
  return <StyledFooter>footer</StyledFooter>;
};

export default Footer;
