import { Box, FormHelperText, Typography } from '@mui/material';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@mui/icons-material/Warning';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { EntityDescription, Registration } from '../../types/registration.types';
import { contributorConfig, isDegree } from '../../utils/registration-helpers';
import { Contributors } from './contributors_tab/Contributors';

export const ContributorsPanel = () => {
  const { t } = useTranslation();
  const {
    values: { entityDescription },
    errors,
    touched,
  } = useFormikContext<Registration>();
  const contributorsError = (errors.entityDescription as FormikErrors<EntityDescription>)?.contributors;
  const contributorsTouched = (touched.entityDescription as FormikTouched<EntityDescription>)?.contributors;
  const publicationInstanceType = entityDescription?.reference?.publicationInstance.type;
  const contributorConfigResult = publicationInstanceType ? contributorConfig[publicationInstanceType] : null;
  const primaryRoles = contributorConfigResult?.primaryRoles ?? [];
  const secondaryRoles = contributorConfigResult?.secondaryRoles ?? [];
  const shouldSeparateAddPrimaryRolesButtons = isDegree(publicationInstanceType as string);

  return (
    <>
      <FieldArray name={ContributorFieldNames.Contributors}>
        {({ push, replace }: FieldArrayRenderProps) =>
          publicationInstanceType ? (
            <>
              {shouldSeparateAddPrimaryRolesButtons && primaryRoles.length > 1 ? (
                primaryRoles.map((primaryRole) => (
                  <Contributors
                    key={primaryRole}
                    push={push}
                    replace={replace}
                    primaryColorAddButton
                    contributorRoles={[primaryRole]}
                  />
                ))
              ) : (
                <Contributors
                  push={push}
                  replace={replace}
                  primaryColorAddButton
                  contributorRoles={[...primaryRoles, ...secondaryRoles]}
                />
              )}
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: '0.5rem', mt: '1rem' }}>
              <WarningIcon color="warning" />
              <Typography fontWeight={500}>{t('registration.contributors.must_select_type_first')}</Typography>
            </Box>
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
