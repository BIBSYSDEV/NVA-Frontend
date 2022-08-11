import { FormHelperText } from '@mui/material';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useEffect, useRef } from 'react';
import { ContributorRole } from '../../types/contributor.types';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { EntityDescription, PublicationInstanceType, Registration } from '../../types/registration.types';
import { contributorConfig, isDegree } from '../../utils/registration-helpers';
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

  const publicationInstanceType = entityDescription?.reference?.publicationInstance.type;
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

  return (
    <>
      <FieldArray name={ContributorFieldNames.Contributors}>
        {
          ({ push, replace }: FieldArrayRenderProps) =>
            publicationInstanceType ? (
              <ContributorsContent
                push={push}
                replace={replace}
                instanceType={publicationInstanceType}
                separatePrimaryRoles={isDegree(publicationInstanceType)}
              />
            ) : null // TODO: must select type first
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

interface ContributorsContentProps extends Pick<FieldArrayRenderProps, 'push' | 'replace'> {
  instanceType: PublicationInstanceType;
  separatePrimaryRoles: boolean;
}

const ContributorsContent = ({ instanceType, separatePrimaryRoles, ...fieldArrayProps }: ContributorsContentProps) => {
  const { primaryRoles, secondaryRoles } = contributorConfig[instanceType];

  return (
    <>
      {separatePrimaryRoles && primaryRoles.length > 1 ? (
        primaryRoles.map((primaryRole) => (
          <Contributors {...fieldArrayProps} primaryColorAddButton contributorRoles={[primaryRole]} />
        ))
      ) : (
        <Contributors {...fieldArrayProps} primaryColorAddButton contributorRoles={primaryRoles} />
      )}
      <Contributors {...fieldArrayProps} contributorRoles={secondaryRoles} />

      {/* TODO: Show contributors with roles that are not valid for this instanceType? */}
    </>
  );
};
