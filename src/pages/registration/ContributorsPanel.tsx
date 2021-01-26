import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, Typography } from '@material-ui/core';
import BackgroundDiv from '../../components/BackgroundDiv';
import theme from '../../themes/mainTheme';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import Authors from './contributors_tab/Authors';

const ContributorsPanel = () => {
  const { t } = useTranslation('registration');
  const {
    values: {
      entityDescription: { contributors },
    },
    errors,
  } = useFormikContext<Registration>();
  const contributorsError = errors.entityDescription?.contributors;

  return (
    <>
      <BackgroundDiv backgroundColor={theme.palette.section.main}>
        <Typography variant="h2" color="primary">
          {t('contributors.authors')}
        </Typography>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, replace }: FieldArrayRenderProps) => <Authors push={push} replace={replace} />}
        </FieldArray>
      </BackgroundDiv>
      {contributors.length === 0 && typeof contributorsError === 'string' && (
        <BackgroundDiv backgroundColor={theme.palette.error.light}>
          <FormHelperText error>
            <ErrorMessage name={ContributorFieldNames.CONTRIBUTORS} />
          </FormHelperText>
        </BackgroundDiv>
      )}
    </>
  );
};

export default ContributorsPanel;
