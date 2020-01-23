import React from 'react';
import { InstitutionSubUnit, InstitutionName } from '../../types/references.types';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StyledSubUnitSelect = styled.div`
  width: 100%;
`;

const StyledSelect = styled(Select)`
  width: 30rem;
`;

const StyledFormControl = styled(FormControl)`
  margin-top: 1rem;
`;

interface SubUnitSelectProps {
  searchResults: InstitutionSubUnit[];
  selectedValue: InstitutionSubUnit;
  valueFunction: (value: InstitutionSubUnit) => void;
  label: string;
}

const SubUnitSelect: React.FC<SubUnitSelectProps> = ({ searchResults, selectedValue, valueFunction, label }) => {
  const { i18n } = useTranslation('profile');

  const selectSubUnit = (cristinUnitId: string) => {
    valueFunction(searchResults.filter(subUnit => subUnit.cristinUnitId === cristinUnitId)[0]);
  };

  const findUnitName = (unitNames: InstitutionName[]) => {
    return unitNames.filter(unitName => unitName.language === i18n.language)[0]?.name ?? unitNames[0].name;
  };

  return (
    <StyledSubUnitSelect>
      <StyledFormControl>
        <InputLabel>{label}</InputLabel>
        <StyledSelect
          value={selectedValue.cristinUnitId}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => selectSubUnit(event.target.value as string)}
          disabled={searchResults.length === 0}>
          {searchResults.map(subUnit => (
            <MenuItem key={subUnit.cristinUnitId} value={subUnit.cristinUnitId}>
              {findUnitName(subUnit.unitNames)}
            </MenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>
    </StyledSubUnitSelect>
  );
};

export default SubUnitSelect;
