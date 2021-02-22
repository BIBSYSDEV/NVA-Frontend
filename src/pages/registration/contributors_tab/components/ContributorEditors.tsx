import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FormHelperText, MuiThemeProvider, Typography } from '@material-ui/core';
import BackgroundDiv from '../../../../components/BackgroundDiv';
import lightTheme from '../../../../themes/lightTheme';
import { ContributorRole } from '../../../../types/contributor.types';
import { ContributorFieldNames } from '../../../../types/publicationFieldNames';
import { Registration } from '../../../../types/registration.types';
import Authors from '../Authors';

export const ContributorEditors = () => {
  const { t } = useTranslation('registration');
  const {
    values: {
      entityDescription: { contributors },
    },
    errors,
    touched,
    setFieldValue,
  } = useFormikContext<Registration>();
  const contributorsError = errors.entityDescription?.contributors;
  const contributorsTouched = touched.entityDescription?.contributors;
  const editorsRef = useRef(contributors);

  useEffect(() => {
    const editors = contributors
      .filter((contributor) => contributor.role === ContributorRole.EDITOR)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
    editorsRef.current = editors;
    return () => {
      editorsRef.current = [];
    };
  }, [contributors]);

  useEffect(() => {
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, editorsRef.current);
  }, [editorsRef, setFieldValue]);

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <Typography variant="h2">{t('contributors.editors')}</Typography>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, replace }: FieldArrayRenderProps) => (
            <MuiThemeProvider theme={lightTheme}>
              <Authors contributorRole={ContributorRole.EDITOR} push={push} replace={replace} />
            </MuiThemeProvider>
          )}
        </FieldArray>
      </BackgroundDiv>
      {contributors.length === 0 && !!contributorsTouched && typeof contributorsError === 'string' && (
        <FormHelperText error>
          <ErrorMessage name={ContributorFieldNames.CONTRIBUTORS} />
        </FormHelperText>
      )}
    </>
  );
};
