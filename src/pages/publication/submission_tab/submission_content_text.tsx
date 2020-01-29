import React from 'react';
import styled from 'styled-components';

const StyledSubmissionContentText = styled.div`
  margin-bottom: 0.3rem;
  font-weight: bold;
`;

interface SubmissionContentTextProps {
  children: any;
}

const SubmissionContentText: React.FC<SubmissionContentTextProps> = ({ children }) => {
  return <StyledSubmissionContentText>{children}</StyledSubmissionContentText>;
};

export default SubmissionContentText;
