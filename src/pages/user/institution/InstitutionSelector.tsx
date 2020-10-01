import React, { FC } from 'react';
import styled from 'styled-components';

import { Field, FieldProps } from 'formik';
import { RecursiveInstitutionUnit } from '../../../types/institution.types';
import InstitutionAutocomplete from '../../../components/institution/InstitutionAutocomplete';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    width: 100%;
  }
`;

interface InstitutionSelectorProps {
  units: RecursiveInstitutionUnit[];
  fieldNamePrefix?: string;
  label?: string;
}

const InstitutionSelector: FC<InstitutionSelectorProps> = ({ units, fieldNamePrefix = '', label }) => {
  return (
    <StyledInstitutionSelector>
      <Field name={`${fieldNamePrefix}.subunit`}>
        {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
          <>
            <InstitutionAutocomplete
              institutions={units}
              onChange={(value) => setFieldValue(name, value)}
              value={value}
              label={label}
            />
            {value?.subunits && <InstitutionSelector units={value.subunits} fieldNamePrefix={name} label={label} />}
          </>
        )}
      </Field>
    </StyledInstitutionSelector>
  );
};

export default InstitutionSelector;
