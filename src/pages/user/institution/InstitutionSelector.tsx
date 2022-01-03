import styled from 'styled-components';

import { Field, FieldProps } from 'formik';
import { RecursiveInstitutionUnit } from '../../../types/institution.types';
import { InstitutionAutocomplete } from '../../../components/institution/InstitutionAutocomplete';
import { Box } from '@mui/system';

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

export const InstitutionSelector = ({ units, fieldNamePrefix = '', label }: InstitutionSelectorProps) => {
  return (
    <StyledInstitutionSelector>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field name={`${fieldNamePrefix}.subunit`}>
          {({ field: { name, value }, form: { setFieldValue } }: FieldProps) => (
            <>
              <InstitutionAutocomplete
                id={name}
                institutions={units}
                onChange={(value) => setFieldValue(name, value)}
                value={value}
                label={label}
              />
              {value?.subunits && <InstitutionSelector units={value.subunits} fieldNamePrefix={name} label={label} />}
            </>
          )}
        </Field>
      </Box>
    </StyledInstitutionSelector>
  );
};
