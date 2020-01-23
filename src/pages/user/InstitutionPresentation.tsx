import React from 'react';
import styled from 'styled-components';
import { InstitutionName } from './../../types/institution.types';
import i18n from './../../translations/i18n';

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

const selectNameByLanguage = (institutionName: InstitutionName[]) => {
  return institutionName.filter(unitName => unitName.language === i18n.language)[0]?.name ?? institutionName[0].name;
};

const InstitutionPresentation: React.FC<InstitutionPresentationProps> = ({ institution, level1, level2 }) => {
  const institutionName = selectNameByLanguage(institution);
  const level1Name = level1 && level1.length > 0 ? selectNameByLanguage(level1) : '';
  const level2Name = level2 && level2?.length > 0 ? selectNameByLanguage(level2) : '';

  return (
    <StyledSelectedInstitution>
      <StyledInstitutionTextMain>{institutionName}</StyledInstitutionTextMain>
      <StyledInstitutionText>{level1Name}</StyledInstitutionText>
      <StyledInstitutionText>{level2Name}</StyledInstitutionText>
    </StyledSelectedInstitution>
  );
};

export default InstitutionPresentation;
