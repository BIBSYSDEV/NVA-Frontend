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

interface ContributorsProps {
  contributorRole?: ContributorRole;
}

export const Contributors = ({ contributorRole = ContributorRole.CREATOR }: ContributorsProps) => {
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
  const contributorsRef = useRef(contributors);

  useEffect(() => {
    const filteredContributors = contributors
      .filter((contributor) => contributor.role === contributorRole)
      .map((contributor, index) => ({ ...contributor, sequence: index + 1 }));
    contributorsRef.current = filteredContributors;
  }, [contributors, contributorRole]);

  useEffect(() => {
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, contributorsRef.current);
  }, [setFieldValue]);

  const getContributorHeading = (contributorRole: ContributorRole) => {
    switch (contributorRole) {
      case ContributorRole.EDITOR:
        return t('contributors.editors');
      case ContributorRole.SUPERVISOR:
        return t('contributors.supervisors');
      default:
        return t('contributors.authors');
    }
  };

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <Typography variant="h2">{getContributorHeading(contributorRole)}</Typography>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, replace }: FieldArrayRenderProps) => (
            <MuiThemeProvider theme={lightTheme}>
              <Authors contributorRole={contributorRole} push={push} replace={replace} />
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
