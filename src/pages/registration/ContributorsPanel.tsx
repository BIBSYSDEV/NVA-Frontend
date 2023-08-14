import WarningIcon from '@mui/icons-material/Warning';
import { Box, FormHelperText, Typography } from '@mui/material';
import { ErrorMessage, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ContributorFieldNames } from '../../types/publicationFieldNames';
import { EntityDescription, Registration } from '../../types/registration.types';
import { contributorConfig } from '../../utils/registration-helpers';
import { Contributors } from './contributors_tab/Contributors';

export const ContributorsPanel = () => {
  const { t } = useTranslation();
  const {
    values: { entityDescription },
    errors,
    touched,
  } = useFormikContext<Registration>();
  const contributorsError = (errors.entityDescription as unknown as FormikErrors<EntityDescription>)?.contributors;
  const contributorsTouched = (touched.entityDescription as unknown as FormikTouched<EntityDescription>)?.contributors;
  const publicationInstanceType = entityDescription?.reference?.publicationInstance?.type;

  const contributorConfigResult = publicationInstanceType ? contributorConfig[publicationInstanceType] : null;
  const primaryRoles = contributorConfigResult?.primaryRoles ?? [];
  const secondaryRoles = contributorConfigResult?.secondaryRoles ?? [];
  const roles = [...primaryRoles, ...secondaryRoles];

  return (
    <>
      <FieldArray name={ContributorFieldNames.Contributors}>
        {({ push, replace }: FieldArrayRenderProps) =>
          publicationInstanceType ? (
            <Contributors push={push} replace={replace} contributorRoles={roles} />
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
