import React from 'react';
import styled from 'styled-components';
import { InstitutionName } from './../../types/institution.types';
import { selectInstitutionNameByLanguage } from './../../utils/helpers';

const StyledSelectedInstitution = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  background-color: ${({ theme }) => theme.palette.text.disabled};
  height: 5rem;
`;

const StyledInstitutionText = styled.div`
  height: 1.5rem;
`;

const StyledInstitutionTextMain = styled(StyledInstitutionText)`
  font-weight: bold;
`;

interface InstitutionPresentationProps {
  institution: InstitutionName[];
  level1?: InstitutionName[];
  level2?: InstitutionName[];
}

const InstitutionPresentation: React.FC<InstitutionPresentationProps> = ({ institution, level1, level2 }) => {
  return (
    <StyledSelectedInstitution>
      <StyledInstitutionTextMain>{selectInstitutionNameByLanguage(institution)}</StyledInstitutionTextMain>
      {level1 && level1.length > 0 && (
        <StyledInstitutionText>{selectInstitutionNameByLanguage(level1)}</StyledInstitutionText>
      )}
      {level2 && level2.length > 0 && (
        <StyledInstitutionText>{selectInstitutionNameByLanguage(level2)}</StyledInstitutionText>
      )}
    </StyledSelectedInstitution>
  );
};

export default InstitutionPresentation;
