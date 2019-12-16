import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { MenuItem } from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import ContributorType from '../../../types/contributor.types';
import StyledContributor from './StyledContributor';
import ContributorStyles from './StyledContributor';
import { Field, useFormikContext } from 'formik';

const StyledContributorValidator = styled(StyledContributor.ContributorContainer)`
  grid-template-areas: 'icon name institution verify-person verify-person arrows delete';
`;

const StyledNameInput = styled(Field)`
  background-color: ${({ theme }) => theme.palette.background.default};
  margin-right: 1rem;
`;

interface ContributorValidatorProps {
  contributor: ContributorType;
  index: number;
  remove: (index: number) => void;
  swap: (indexA: number, indexB: number) => void;
}

const ContributorValidator: React.FC<ContributorValidatorProps> = ({ index, remove, swap }) => {
  const { t } = useTranslation();
  const { setFieldValue } = useFormikContext();

  const validateContributor = (name: string) => {
    name && setFieldValue(`contributors.authors[${index}].verified` as never, 'true');
  };

  return (
    <Field name={`contributors.authors[${index}]`}>
      {({ form: { values } }: any) => {
        return (
          <StyledContributorValidator>
            <StyledContributor.AddCircleIcon />
            <StyledNameInput variant="outlined" name={`contributors.authors[${index}].name`} validateOnChange="false" />
            <StyledContributor.Select variant="outlined">
              <MenuItem value=""></MenuItem>
            </StyledContributor.Select>
            <StyledContributor.VerifyPerson
              color="primary"
              variant="contained"
              startIcon={<PersonIcon />}
              onClick={() => validateContributor(values.contributors.authors[index].name)}>
              {t('publication:contributors.verify_person')}
            </StyledContributor.VerifyPerson>
            <ContributorStyles.ContributorsArrows
              swap={swap}
              first={index === 0}
              last={index === values.contributors.authors.length - 1}
              index={index}
            />
            <StyledContributor.DeleteIcon onClick={() => remove(index)} />
          </StyledContributorValidator>
        );
      }}
    </Field>
  );
};

export default ContributorValidator;
