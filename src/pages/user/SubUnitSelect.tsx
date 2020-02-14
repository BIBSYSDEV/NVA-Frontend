import React from 'react';
import { InstitutionSubUnit } from '../../types/institution.types';
import { selectInstitutionNameByLanguage } from './../../utils/helpers';
import { Select, MenuItem, FormControl, InputLabel } from '@material-ui/core';
import styled from 'styled-components';
import { InstitutionSubUnitChild } from './../../types/institution.types';

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
  searchResults: InstitutionSubUnitChild[];
  selectedValue: InstitutionSubUnit;
  findSubUnitFunction: (value: string) => void;
  label: string;
  dataTestId: string;
}

const SubUnitSelect: React.FC<SubUnitSelectProps> = ({
  searchResults,
  selectedValue,
  findSubUnitFunction,
  label,
  dataTestId,
}) => {
  const selectSubUnit = (cristinUnitId: string) => {
    findSubUnitFunction(searchResults.find(subUnit => subUnit.cristinUnitId === cristinUnitId)?.cristinUnitId ?? '');
  };

  return (
    <StyledSubUnitSelect>
      <StyledFormControl variant="outlined">
        <InputLabel>{label}</InputLabel>
        <StyledSelect
          value={selectedValue?.cristinUnitId}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => selectSubUnit(event.target.value as string)}
          disabled={searchResults.length === 0}
          data-testid={dataTestId}>
          {searchResults.map(subUnit => (
            <MenuItem key={subUnit.cristinUnitId} value={subUnit.cristinUnitId}>
              {selectInstitutionNameByLanguage(subUnit.subunitNames)}
            </MenuItem>
          ))}
        </StyledSelect>
      </StyledFormControl>
    </StyledSubUnitSelect>
  );
};

export default SubUnitSelect;
