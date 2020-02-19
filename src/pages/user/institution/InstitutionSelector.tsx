import React, { useState, FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import InstitutionSearch from '../../publication/references_tab/components/InstitutionSearch';
import styled from 'styled-components';
import { Button, FormControl, Select, MenuItem } from '@material-ui/core';
import { Unit, emptyUnit } from '../../../types/institution.types';
import { Field, FormikProps, useFormikContext } from 'formik';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

const StyledFormControl = styled(FormControl)`
  margin-top: 1rem;
`;

interface InstitutionSelectorProps {
  unit: Unit;
  counter: number;
}

const InstitutionSelector: FC<InstitutionSelectorProps> = ({ unit, counter }) => {
  const { t } = useTranslation('profile');

  const { values, setFieldValue }: FormikProps<any> = useFormikContext();

  const handleChange = (event: any, value: any) => {
    const name = event.target.value;
    const subunit = unit.subunits.find((unit: any) => unit.name === name);
    let currentCounter = 0;

    if (!value) {
      setFieldValue(`subunits[${counter}].name`, event.target.value);
      setFieldValue(`subunits[${counter}].id`, subunit!.id);
      ++currentCounter;
    } else {
      for (let i = 0; i < currentCounter + 1; i++) {
        setFieldValue(`subunits[${counter - 1}].name`, event.target.value);
        setFieldValue(`subunits[${counter - 1}].id`, subunit!.id);
        setFieldValue(`subunits[${counter}].name`, '');
        setFieldValue(`subunits[${counter}].id`, '');
        setFieldValue(`subunits[${counter + 1}].name`, '');
        setFieldValue(`subunits[${counter + 1}].id`, '');
      }
    }
  };

  return (
    <>
      <StyledInstitutionSelector>
        {unit && unit.subunits && unit.subunits.length > 0 ? (
          <>
            <Field name={`subunits[${counter}].name`}>
              {({ field: { value } }: any) => (
                <>
                  <StyledFormControl fullWidth variant="outlined">
                    <Select value={value || ''} onChange={(event: any) => handleChange(event, value)}>
                      {unit.subunits.length > 0 &&
                        unit.subunits.map((unit: any) => {
                          return (
                            <MenuItem key={unit.id} value={unit.name}>
                              {unit.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </StyledFormControl>
                  {value && unit.subunits.length > 0 ? (
                    <InstitutionSelector
                      key={unit.id}
                      unit={unit.subunits.find((unit: any) => unit.name === value) || emptyUnit}
                      counter={++counter}
                    />
                  ) : null}
                </>
              )}
            </Field>
          </>
        ) : null}
      </StyledInstitutionSelector>
    </>
  );
};

export default InstitutionSelector;
