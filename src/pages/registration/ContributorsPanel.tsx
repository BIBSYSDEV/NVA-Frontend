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
      role: contributor.role ?? ContributorRole.Creator,
    }));
    setFieldValue(ContributorFieldNames.CONTRIBUTORS, contributorsWithRole);
  }, [setFieldValue]);

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <FieldArray name={ContributorFieldNames.CONTRIBUTORS}>
          {({ push, replace }: FieldArrayRenderProps) => (
            <>
              {publicationContext.type === PublicationType.DEGREE ? (
                <>
                  <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Creator]} />
                  <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Supervisor]} />
                  <Contributors
                    push={push}
                    replace={replace}
                    contributorRoles={Object.values(ContributorRole).filter(
                      (role) => role !== ContributorRole.Creator && role !== ContributorRole.Supervisor
                    )}
                  />
                </>
              ) : publicationInstance.type === BookType.ANTHOLOGY ? (
                <>
                  <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Editor]} />
                  <Contributors
                    push={push}
                    replace={replace}
                    contributorRoles={Object.values(ContributorRole).filter((role) => role !== ContributorRole.Editor)}
                  />
                </>
              ) : (
                <>
                  <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Creator]} />
                  <Contributors
                    push={push}
                    replace={replace}
                    contributorRoles={Object.values(ContributorRole).filter((role) => role !== ContributorRole.Creator)}
                  />
                </>
              )}
            </>
          )}
        </FieldArray>
      </BackgroundDiv>
      {!!contributorsTouched && typeof contributorsError === 'string' && (
        <FormHelperText error>
          <ErrorMessage name={ContributorFieldNames.CONTRIBUTORS} />
        </FormHelperText>
      )}
    </>
  );
};

export default ContributorsPanel;
