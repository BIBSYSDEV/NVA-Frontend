import React, { FC } from 'react';
import styled from 'styled-components';
import Label from '../../../components/Label';
import { Unit } from '../../../types/institution.types';

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

const InstitutionCard: FC = () => {
  // get Formik values here Presentation.tsx
  return (
    <>
      {unit.id && (
        <StyledSelectedInstitution data-testid="institution-presentation">
          {unit.subunits.length > 0 &&
            unit.subunits.map((subunit: Unit, index: number) => {
              return index === 0 ? (
                <Label data-testid="institution-presentation-top" key={`institution-${unit.id}`}>
                  {subunit.name}
                  {/* {institutionUnit.cristinUnitId && <Button onClick={() => setOpenEdit(true)}>{t('common:edit')}</Button>} */}
                </Label>
              ) : (
                <StyledInstitutionText
                  data-testid="institution-presentation-subunit-1"
                  key={`institution-${unit.id}-${index}`}>
                  {subunit.name}
                </StyledInstitutionText>
              );
            })}
        </StyledSelectedInstitution>
      )}
    </>
  );
};

export default InstitutionCard;
