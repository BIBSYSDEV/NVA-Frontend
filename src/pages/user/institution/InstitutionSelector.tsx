import React, { FC } from 'react';
import styled from 'styled-components';

import { Field, FieldProps } from 'formik';
import { RecursiveInstitutionUnit } from '../../../types/institution.types';
import InstitutionAutocomplete from '../../../components/institution/InstitutionAutocomplete';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

interface InstitutionSelectorProps {
  units: RecursiveInstitutionUnit[];
  fieldNamePrefix?: string;
}

const InstitutionSelector: FC<InstitutionSelectorProps> = ({ units, fieldNamePrefix = '' }) => {
  return (
    <StyledInstitutionSelector>
      <Field name={`${fieldNamePrefix}.subunit`}>
        {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
          <>
            <InstitutionAutocomplete
              institutions={units}
              onChange={(value) => setFieldValue(name, value)}
              value={value}
            />
            {value?.subunits && <InstitutionSelector units={value.subunits} fieldNamePrefix={name} />}
          </>
        )}
      </Field>
    </StyledInstitutionSelector>
  );
};

export default InstitutionSelector;
