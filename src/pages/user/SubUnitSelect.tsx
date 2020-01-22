import React, { useState } from 'react';
import { InstitutionSubUnit, InstitutionName } from '../../types/references.types';
import { Select, MenuItem } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

interface SubUnitSelectProps {
  searchResults: InstitutionSubUnit[];
  selectedValue: InstitutionSubUnit;
  valueFunction: (value: InstitutionSubUnit) => void;
}

const SubUnitSelect: React.FC<SubUnitSelectProps> = ({ searchResults, selectedValue, valueFunction }) => {
  const [value, setValue] = useState('');
  const { i18n } = useTranslation('profile');

  const selectSubUnit = (cristinUnitId: string) => {
    valueFunction(searchResults.filter(subUnit => subUnit.cristinUnitId === cristinUnitId)[0]);
    setValue(cristinUnitId);
  };

  const findUnitName = (unitNames: InstitutionName[]) => {
    console.log(i18n.language);
    return unitNames.filter(unitName => unitName.language === i18n.language) && unitNames[0].name;
  };

  return (
    <div>
      {searchResults.length > 0 && (
        <Select
          value={value}
          onChange={(event: React.ChangeEvent<{ value: unknown }>) => selectSubUnit(event.target.value as string)}>
          {searchResults.map(subUnit => (
            <MenuItem key={subUnit.cristinUnitId} value={subUnit.cristinUnitId}>
              {findUnitName(subUnit.unitNames)}
            </MenuItem>
          ))}
        </Select>
      )}
    </div>
  );
};

export default SubUnitSelect;
