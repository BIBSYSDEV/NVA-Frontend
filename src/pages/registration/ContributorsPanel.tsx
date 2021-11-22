import { FormHelperText } from '@mui/material';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import React, { useEffect, useRef } from 'react';
import { BackgroundDiv } from '../../components/BackgroundDiv';
import { lightTheme } from '../../themes/lightTheme';
import { ContributorRole } from '../../types/contributor.types';
import { BookType, ContributorFieldNames } from '../../types/publicationFieldNames';
import { EntityDescription, Registration } from '../../types/registration.types';
import { isArtistic, isDegree } from '../../utils/registration-helpers';
import { Contributors } from './contributors_tab/Contributors';

export const ContributorsPanel = () => {
  const {
    values: { entityDescription },
    errors,
    touched,
    setFieldValue,
  } = useFormikContext<Registration>();
  const contributorsError = (errors.entityDescription as FormikErrors<EntityDescription>)?.contributors;
  const contributorsTouched = (touched.entityDescription as FormikTouched<EntityDescription>)?.contributors;

  const publicationInstanceType = entityDescription?.reference?.publicationInstance.type ?? '';
  const contributors = entityDescription?.contributors ?? [];
  const contributorsRef = useRef(contributors);

  useEffect(() => {
    // Ensure all contributors has a role by setting Creator role as default
    const contributorsWithRole = contributorsRef.current.map((contributor) => ({
      ...contributor,
      role: contributor.role ?? ContributorRole.Creator,
    }));
    setFieldValue(ContributorFieldNames.Contributors, contributorsWithRole);
  }, [setFieldValue]);

  // Creator should not be selectable for other contributors
  const selectableContributorRoles = Object.values(ContributorRole).filter((role) => role !== ContributorRole.Creator);

  return (
    <>
      <FieldArray name={ContributorFieldNames.Contributors}>
        {({ push, replace }: FieldArrayRenderProps) =>
          isDegree(publicationInstanceType) ? (
            <>
              <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
                <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Creator]} />
              </BackgroundDiv>
              <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
                <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Supervisor]} />
              </BackgroundDiv>
              <BackgroundDiv backgroundColor={lightTheme.palette.section.megaDark}>
                <Contributors
                  push={push}
                  replace={replace}
                  contributorRoles={selectableContributorRoles.filter((role) => role !== ContributorRole.Supervisor)}
                />
              </BackgroundDiv>
            </>
          ) : publicationInstanceType === BookType.Anthology ? (
            <>
              <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
                <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Editor]} />
              </BackgroundDiv>
              <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
                <Contributors
                  push={push}
                  replace={replace}
                  contributorRoles={selectableContributorRoles.filter((role) => role !== ContributorRole.Editor)}
                />
              </BackgroundDiv>
            </>
          ) : isArtistic(publicationInstanceType) ? (
            <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
              <Contributors
                push={push}
                replace={replace}
                contributorRoles={[
                  ContributorRole.Designer,
                  ContributorRole.CuratorOrganizer,
                  ContributorRole.Consultant,
                  ContributorRole.Other,
                ]}
              />
            </BackgroundDiv>
          ) : (
            <>
              <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
                <Contributors push={push} replace={replace} contributorRoles={[ContributorRole.Creator]} />
              </BackgroundDiv>
              <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
                <Contributors push={push} replace={replace} contributorRoles={selectableContributorRoles} />
              </BackgroundDiv>
            </>
          )
        }
      </FieldArray>
      {!!contributorsTouched && typeof contributorsError === 'string' && (
        <FormHelperText error>
          <ErrorMessage name={ContributorFieldNames.Contributors} />
        </FormHelperText>
      )}
    </>
  );
};
