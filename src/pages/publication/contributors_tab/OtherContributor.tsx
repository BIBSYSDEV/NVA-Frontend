import { Field, FormikProps, useFormikContext } from 'formik';
import React from 'react';
import styled from 'styled-components';

import { MenuItem } from '@material-ui/core';

import ContributorType from '../../../types/contributor.types';
import { PublicationFormsData } from '../../../types/form.types';
import contributorTypes from '../../../utils/testfiles/contributor_types.json';
import StyledContributor from './StyledContributor';

const StyledNameInput = styled(Field)`
  background-color: ${({ theme }) => theme.palette.background.default};
  margin-right: 1rem;
`;

interface OtherContributorProps {
  contributor: ContributorType;
  index: number;
  swap: (indexA: number, indexB: number) => void;
  remove: (index: number) => void;
}

const OtherContributor: React.FC<OtherContributorProps> = ({ contributor, index, swap, remove }) => {
  const { setFieldValue }: FormikProps<PublicationFormsData> = useFormikContext();

  return (
    <Field name={`contributors[${index}]`}>
      {({ form: { values } }: any) => {
        return (
          <StyledContributor.OtherContributorContainer>
            <Field name={`contributors[${index}].type`}>
              {({ field }: any) => {
                return (
                  <StyledContributor.TypeSelect
                    value={field.value || ''}
                    variant="outlined"
                    onChange={event => setFieldValue(field.name, event.target.value)}>
                    >
                    <MenuItem value="" key="-1" />
                    {contributorTypes
                      .filter(type => type !== 'Author')
                      .map(type => (
                        <MenuItem value={type} key={type}>
                          {type}
                        </MenuItem>
                      ))}
                  </StyledContributor.TypeSelect>
                );
              }}
            </Field>
            <StyledNameInput variant="outlined" name={`contributors[${index}].name`} />
            <Field name={`contributors[${index}].selectedInstitution`}>
              {({ field }: any) => {
                return (
                  <StyledContributor.InstitutionSelect
                    value={field.value || ''}
                    variant="outlined"
                    onChange={event => setFieldValue(field.name, event?.target.value)}>
                    <MenuItem value="" key="-1" />
                    {/* {contributor?.institutions?.map(institution => (
                      <MenuItem value={institution} key={institution}>
                        {institution}
                      </MenuItem>
                    ))} */}
                  </StyledContributor.InstitutionSelect>
                );
              }}
            </Field>
            <StyledContributor.ContributorsArrows
              first={index === 0}
              last={index === values.contributors.length - 1}
              swap={swap}
              index={index}
            />
            <StyledContributor.DeleteIcon onClick={() => remove(index)} />
          </StyledContributor.OtherContributorContainer>
        );
      }}
    </Field>
  );
};

export default OtherContributor;
