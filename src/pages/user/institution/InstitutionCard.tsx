import React, { FC } from 'react';
import styled from 'styled-components';
import Label from '../../../components/Label';
import { Unit } from '../../../types/institution.types';
import { FormikProps, useFormikContext } from 'formik';

const StyledSelectedInstitution = styled.div`
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  min-height: 5rem;
`;

const StyledInstitutionText = styled.div`
  height: 1.5rem;
`;

const InstitutionCard: FC = () => {
  const { values }: FormikProps<any> = useFormikContext();

  return (
    <>
      <StyledSelectedInstitution data-testid="institution-presentation">
        <Label>{values.institution?.name}</Label>
        {values.subunits.length > 0 &&
          values.subunits.map((subunit: Unit) => (
            <>
              {subunit.name !== '' && (
                <StyledInstitutionText
                  data-testid="institution-presentation-subunit-1"
                  key={`institution-${subunit.id}`}>
                  {subunit.name}
                </StyledInstitutionText>
              )}
            </>
          ))}
      </StyledSelectedInstitution>
    </>
  );
};

export default InstitutionCard;
