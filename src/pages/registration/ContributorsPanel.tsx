import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, Typography } from '@material-ui/core';
import { useFormikContext, FieldArray, ErrorMessage, FieldArrayRenderProps } from 'formik';
import Card from '../../components/Card';
import { Registration } from '../../types/registration.types';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
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
    <Card>
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
    </Card>
  );
};

export default ContributorsPanel;
