import React, { FC } from 'react';
import styled from 'styled-components';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { Unit, emptyUnit, Subunit } from '../../../types/institution.types';
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
  const { values, setFieldValue }: FormikProps<any> = useFormikContext();

  const handleChange = (newValue: string, previousValue: string) => {
    const subunit = unit.subunits?.find((subunit: Subunit) => subunit.name === newValue);

    if (!previousValue) {
      setFieldValue(`subunits[${counter}].name`, newValue);
      setFieldValue(`subunits[${counter}].id`, subunit!.id);
    } else {
      setFieldValue(`subunits[${counter - 1}].name`, newValue);
      setFieldValue(`subunits[${counter - 1}].id`, subunit!.id);

      for (let i = counter; i < values.subunits.length; i++) {
        setFieldValue(`subunits[${i}].name`, '');
        setFieldValue(`subunits[${i}].id`, '');
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
                    <Select
                      data-testid={`unit-selector-${counter}`}
                      value={value || ''}
                      onChange={(event: React.ChangeEvent<any>) => handleChange(event.target.value, value)}>
                      {unit.subunits &&
                        unit.subunits.length > 0 &&
                        unit.subunits.map((subunit: Subunit) => {
                          return (
                            <MenuItem key={subunit.id} value={subunit.name}>
                              {subunit.name}
                            </MenuItem>
                          );
                        })}
                    </Select>
                  </StyledFormControl>
                  {value && unit.subunits && unit.subunits.length > 0 ? (
                    <InstitutionSelector
                      key={unit.id}
                      unit={unit.subunits.find((unit: Unit) => unit.name === value) || emptyUnit}
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
