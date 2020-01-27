import React from 'react';
import styled from 'styled-components';

const StyledSubmissionContentText = styled.div`
  margin-bottom: 0.3rem;
  font-weight: bold;
`;

interface SubmissionContentTextProps {
  children: any;
  dataTestId?: string;
}

const SubmissionContentText: React.FC<SubmissionContentTextProps> = ({ children, dataTestId }) => {
  return <StyledSubmissionContentText data-testid={dataTestId}>{children}</StyledSubmissionContentText>;
};

export default SubmissionContentText;
