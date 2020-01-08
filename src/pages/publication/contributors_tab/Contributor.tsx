import React from 'react';
import styled from 'styled-components';

import MenuItem from '@material-ui/core/MenuItem';

import ContributorType from '../../../types/contributor.types';
import ContributorStyles from './StyledContributor';
import { Field, useFormikContext, FormikProps } from 'formik';

const StyledContainer = styled(ContributorStyles.ContributorContainer)`
  margin-bottom: 0.5rem;
  align-items: center;
`;

const StyledInstitutionSelect = styled(ContributorStyles.Select)`
  grid-area: institution;
`;

interface ContributorProps {
  contributor: ContributorType;
  index: number;
  swap: (indexA: number, indexB: number) => void;
  remove: (index: number) => void;
}

const Contributor: React.FC<ContributorProps> = ({ contributor, index, swap, remove }) => {
  const { setFieldValue, values }: FormikProps<any> = useFormikContext();

  return (
    <Field name={`authors[${index}]`}>
      {() => (
        <StyledContainer>
          <ContributorStyles.PersonIcon />
          <ContributorStyles.Name>{contributor.name}</ContributorStyles.Name>
          <Field name={`authors[${index}].selectedInstitution`}>
            {({ field }: any) => {
              return (
                <StyledInstitutionSelect
                  onChange={event => setFieldValue(field.name, event.target.value)}
                  value={contributor.institution || ''}
                  variant="outlined">
                  <MenuItem value="" key="-1" />
                  {/* {contributor?.institutions?.map(institution => (
                    <MenuItem value={institution} key={institution}>
                      {institution}
                    </MenuItem>
                  ))} */}
                </StyledInstitutionSelect>
              );
            }}
          </Field>
          <Field name={`authors[${index}].corresponding`}>{() => <ContributorStyles.CorrespondingAuthor />}</Field>
          <ContributorStyles.OrcidIcon>
            {contributor.orcid && (
              <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />
            )}
          </ContributorStyles.OrcidIcon>
          <ContributorStyles.ContributorsArrows
            first={index === 0}
            last={index === values.authors.length - 1}
            swap={swap}
            index={index}
          />
          <ContributorStyles.DeleteIcon onClick={() => remove(index)} />
        </StyledContainer>
      )}
    </Field>
  );
};

export default Contributor;
