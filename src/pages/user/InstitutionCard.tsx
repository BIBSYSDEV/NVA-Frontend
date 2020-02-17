import React, { FC } from 'react';
import styled from 'styled-components';
import { InstitutionUnit } from '../../types/institution.types';
import { selectInstitutionNameByLanguage } from '../../utils/helpers';
import FormCardLabel from '../../components/FormCard/FormCardLabel';

const StyledSelectedInstitution = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  min-height: 5rem;
`;

const StyledInstitutionText = styled.div`
  height: 1.5rem;
`;

interface InstitutionCardProps {
  institutionUnit: InstitutionUnit;
}

const InstitutionCard: FC<InstitutionCardProps> = ({ institutionUnit }) => {
  const institutionId = institutionUnit.cristinUnitId;

  return (
    <>
      {institutionId && (
        <StyledSelectedInstitution data-testid="institution-presentation">
          {institutionUnit.subUnits.map((subUnit, index) => {
            return index === 0 ? (
              <FormCardLabel data-testid="institution-presentation-top" key={`institution-${institutionId}-${index}`}>
                {selectInstitutionNameByLanguage(subUnit.unitNames)}
                {/* {institutionUnit.cristinUnitId && <Button onClick={() => setOpenEdit(true)}>{t('common:edit')}</Button>} */}
              </FormCardLabel>
            ) : (
              <StyledInstitutionText
                data-testid="institution-presentation-subunit-1"
                key={`institution-${institutionId}-${index}`}>
                {selectInstitutionNameByLanguage(subUnit.unitNames)}
              </StyledInstitutionText>
            );
          })}
        </StyledSelectedInstitution>
      )}
    </>
  );
};

export default InstitutionCard;
