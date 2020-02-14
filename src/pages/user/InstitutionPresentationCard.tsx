import React, { useState } from 'react';
import styled from 'styled-components';
import { InstitutionUnit } from '../../types/institution.types';
import { selectInstitutionNameByLanguage } from '../../utils/helpers';
import InstitutionSelector from './InstitutionSelector';

const StyledSelectedInstitution = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  height: 5rem;
`;

const StyledInstitutionText = styled.div`
  height: 1.5rem;
`;

const StyledInstitutionTextMain = styled(StyledInstitutionText)`
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`;

interface InstitutionPresentationProps {
  institutionUnit: InstitutionUnit;
  addNewInstitutionUnit: (cristinUnitId: string) => void;
}

const InstitutionCard: React.FC<InstitutionPresentationProps> = ({ institutionUnit, addNewInstitutionUnit }) => {
  const [open, setOpen] = useState(false);

  const institutionId = institutionUnit.cristinUnitId;

  return (
    <>
      {institutionId && (
        <StyledSelectedInstitution data-testid="institution-presentation">
          {institutionUnit.subUnits.map((subUnit, index) => {
            return index === 0 ? (
              <StyledInstitutionTextMain
                data-testid="institution-presentation-top"
                key={`institution-${institutionId}-${index}`}>
                {selectInstitutionNameByLanguage(subUnit.unitNames)}
                {/* {institutionUnit.cristinUnitId && <Button onClick={() => setOpenEdit(true)}>{t('common:edit')}</Button>} */}
              </StyledInstitutionTextMain>
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
      {open && (
        <InstitutionSelector
          institutionUnit={institutionUnit}
          disabled={!!institutionUnit.cristinUnitId}
          addNewInstitutionUnit={addNewInstitutionUnit}
          setOpen={setOpen}
        />
      )}
    </>
  );
};

export default InstitutionCard;
