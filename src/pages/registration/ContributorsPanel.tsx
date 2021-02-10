import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, MuiThemeProvider, Typography } from '@material-ui/core';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
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
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <Typography variant="h2">{t('contributors.authors')}</Typography>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, replace }: FieldArrayRenderProps) => (
            <MuiThemeProvider theme={lightTheme}>
              <Authors push={push} replace={replace} />
            </MuiThemeProvider>
          )}
        </FieldArray>
      </BackgroundDiv>
      {contributors.length === 0 && typeof contributorsError === 'string' && (
        <FormHelperText error>
          <ErrorMessage name={ContributorFieldNames.CONTRIBUTORS} />
        </FormHelperText>
      )}
    </>
  );
};

export default ContributorsPanel;
