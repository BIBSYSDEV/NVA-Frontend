import { FormHelperText } from '@material-ui/core';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import BackgroundDiv from '../../components/BackgroundDiv';
import lightTheme from '../../themes/lightTheme';
import { ContributorRole } from '../../types/contributor.types';
import { BookType, ContributorFieldNames, PublicationType } from '../../types/publicationFieldNames';
import { Registration } from '../../types/registration.types';
import { Contributors } from './contributors_tab/Contributors';

const ContributorsPanel = () => {
  const {
    values: {
      entityDescription: {
        reference: { publicationContext, publicationInstance },
        contributors,
      },
    },
    errors,
    touched,
    setFieldValue,
  } = useFormikContext<Registration>();

  const contributorsError = errors.entityDescription?.contributors;
  const contributorsTouched = touched.entityDescription?.contributors;
  const contributorsRef = useRef(contributors);

  useEffect(() => {
    // Ensure all contributors has a role by setting Creator role as default
    const contributorsWithRole = contributorsRef.current.map((contributor) => ({
      ...contributor,
      role: contributor.role ?? ContributorRole.CREATOR,
    }));
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, contributorsWithRole);
  }, [setFieldValue]);

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, replace }: FieldArrayRenderProps) =>
            publicationContext.type === PublicationType.DEGREE ? (
              <>
                <Contributors push={push} replace={replace} />
                <Contributors contributorRole={ContributorRole.SUPERVISOR} push={push} replace={replace} />
              </>
            ) : publicationInstance.type === BookType.ANTHOLOGY ? (
              <Contributors contributorRole={ContributorRole.EDITOR} push={push} replace={replace} />
            ) : (
              <Contributors push={push} replace={replace} />
            )
          }
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

export default ContributorsPanel;
