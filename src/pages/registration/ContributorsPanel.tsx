import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, Typography } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import Section from '../../components/Section';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import Authors from './contributors_tab/Authors';

const ContributorsPanel = () => {
  const { t } = useTranslation('registration');
  const theme = useTheme();
  const {
    values: {
      entityDescription: { contributors },
    },
    errors,
  } = useFormikContext<Registration>();
  const contributorsError = errors.entityDescription?.contributors;

  return (
    <Section backgroundColor={theme.palette.section.main}>
      <Typography variant="h2">{t('contributors.authors')}</Typography>
      <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
        {({ push, replace, name }: FieldArrayRenderProps) => (
          <>
            <Authors push={push} replace={replace} />
            {contributors.length === 0 && typeof contributorsError === 'string' && (
              <FormHelperText error>
                <ErrorMessage name={name} />
              </FormHelperText>
            )}
          </>
        )}
      </FieldArray>
    </Section>
  );
};

export default ContributorsPanel;
