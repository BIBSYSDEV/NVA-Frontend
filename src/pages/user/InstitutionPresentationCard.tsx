import React, { useState } from 'react';
import styled from 'styled-components';
import { InstitutionUnit } from '../../types/institution.types';
import { selectInstitutionNameByLanguage } from '../../utils/helpers';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
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

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

interface InstitutionPresentationProps {
  institutionUnit: InstitutionUnit;
  addNewInstitutionUnit: (cristinUnitId: string) => void;
}

const InstitutionPresentation: React.FC<InstitutionPresentationProps> = ({
  institutionUnit,
  addNewInstitutionUnit,
}) => {
  const [selectedCristinUnitId, setSelectedCristinUnitId] = useState(institutionUnit?.cristinUnitId || '');
  const [openEdit, setOpenEdit] = useState(false);
  const { t } = useTranslation('profile');

  const handleConfirm = () => {
    setOpenEdit(false);
    addNewInstitutionUnit(selectedCristinUnitId);
  };

  return (
    <>
      {institutionUnit.cristinUnitId && (
        <StyledSelectedInstitution data-testid="institution-presentation">
          {institutionUnit.institutionName && institutionUnit.institutionName.length > 0 && (
            <StyledInstitutionTextMain data-testid="institution-presentation-top">
              {selectInstitutionNameByLanguage(institutionUnit.institutionName)}
              {institutionUnit.cristinUnitId && <Button onClick={() => setOpenEdit(true)}>{t('common:edit')}</Button>}
            </StyledInstitutionTextMain>
          )}
          {institutionUnit.level1Name && institutionUnit.level1Name.length > 0 && (
            <StyledInstitutionText data-testid="institution-presentation-subunit-1">
              {selectInstitutionNameByLanguage(institutionUnit.level1Name)}
            </StyledInstitutionText>
          )}
          {institutionUnit.level2Name && institutionUnit.level2Name.length > 0 && (
            <StyledInstitutionText data-testid="institution-presentation-subunit-2">
              {selectInstitutionNameByLanguage(institutionUnit.level2Name)}
            </StyledInstitutionText>
          )}
        </StyledSelectedInstitution>
      )}
      {(!!!institutionUnit.cristinUnitId || openEdit) && (
        <>
          <InstitutionSelector
            setSelectedCristinUnitId={setSelectedCristinUnitId}
            disabled={!!institutionUnit.cristinUnitId}
          />
          <StyledButton
            onClick={() => handleConfirm()}
            variant="contained"
            color="secondary"
            disabled={!!!selectedCristinUnitId}>
            Add
          </StyledButton>
          <StyledButton
            onClick={() => {
              setOpenEdit(false);
            }}
            variant="contained"
            color="secondary">
            Cancel
          </StyledButton>
        </>
      )}
    </>
  );
};

export default InstitutionPresentation;
