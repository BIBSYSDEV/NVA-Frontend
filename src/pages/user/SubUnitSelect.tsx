import React from 'react';
import { InstitutionSubUnit } from '../../types/institution.types';
import { selectNameByLanguage } from './../../utils/helpers';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
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
  const selectSubUnit = (cristinUnitId: string) => {
    valueFunction(searchResults.filter(subUnit => subUnit.cristinUnitId === cristinUnitId)[0]);
  };

  return (
    <StyledSubUnitSelect>
      <StyledFormControl variant="outlined">
        <InputLabel>{label}</InputLabel>
        <StyledSelect
          value={selectedValue.cristinUnitId}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => selectSubUnit(event.target.value as string)}
          disabled={searchResults.length === 0}>
          {searchResults.map(subUnit => (
            <MenuItem key={subUnit.cristinUnitId} value={subUnit.cristinUnitId}>
              {selectNameByLanguage(subUnit.unitNames)}
            </MenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>
    </StyledSubUnitSelect>
  );
};

export default SubUnitSelect;
