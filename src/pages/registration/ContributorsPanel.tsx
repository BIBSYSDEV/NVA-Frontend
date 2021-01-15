import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText } from '@material-ui/core';
import BackgroundDiv from '../../components/BackgroundDiv';
import ContrastTypography from '../../components/ContrastTypography';
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
    <BackgroundDiv backgroundColor={theme.palette.section.main}>
      <ContrastTypography backgroundColor={theme.palette.section.main} variant="h2">
        {t('contributors.authors')}
      </ContrastTypography>
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
    </BackgroundDiv>
  );
};

export default ContributorsPanel;
