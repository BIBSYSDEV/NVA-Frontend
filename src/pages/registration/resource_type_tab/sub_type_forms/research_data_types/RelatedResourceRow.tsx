import { Box, Link, ListItem, Skeleton, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { ConfirmDialog } from '../../../../../components/ConfirmDialog';
import { Registration, RelatedDocument } from '../../../../../types/registration.types';
import { API_URL } from '../../../../../utils/constants';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useFetch } from '../../../../../utils/hooks/useFetch';
import { getTitleString } from '../../../../../utils/registration-helpers';
import { getRegistrationLandingPagePath } from '../../../../../utils/urlPaths';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';

interface RelatedResourceRowRowProps {
  removeRelatedResource: () => void;
  document: RelatedDocument;
  index: number;
}

export const RelatedResourceRow = ({ removeRelatedResource, document, index }: RelatedResourceRowRowProps) => {
  const { t } = useTranslation();
  const uri = document.type === 'ConfirmedDocument' ? document.identifier : '';
  const isInternalRegistration = uri.includes(API_URL);
  const [registration, isLoadingRegistration] = useFetch<Registration>({ url: isInternalRegistration ? uri : '' });
  const [confirmRemoveRelation, setConfirmRemoveRelation] = useState(false);
  const isConfirmedDocument = document.type === 'ConfirmedDocument';

  return isConfirmedDocument ? (
    <ListItem disableGutters>
      {isLoadingRegistration ? (
        <Skeleton width="30%" />
      ) : (
        <>
          {isInternalRegistration ? (
            <Link
              data-testid={dataTestId.registrationWizard.resourceType.relatedRegistrationLink(
                registration?.identifier ?? ''
              )}
              component={RouterLink}
              to={getRegistrationLandingPagePath(registration?.identifier ?? '')}>
              {getTitleString(registration?.entityDescription?.mainTitle)}
            </Link>
          ) : (
            <Link data-testid={dataTestId.registrationWizard.resourceType.externalLink} href={uri}>
              {uri}
            </Link>
          )}
        </>
      )}
      <ConfirmDialog
        open={confirmRemoveRelation}
        title={t('registration.resource_type.research_data.remove_relation')}
        onAccept={removeRelatedResource}
        onCancel={() => setConfirmRemoveRelation(false)}>
        <Typography>{t('registration.resource_type.research_data.remove_relation_confirm_text')}</Typography>
      </ConfirmDialog>
    </ListItem>
  ) : (
    <Box
      key={index}
      component="li"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: '0.25rem 1rem',
        mb: '0.5rem',
        width: '100%',
      }}>
      <Field name={`${ResourceFieldNames.PublicationInstanceRelated}[${index}].text`}>
        {({ field, meta: { touched, error } }: FieldProps<string>) => (
          <TextField
            {...field}
            label={t('registration.resource_type.related_result')}
            variant="filled"
            multiline
            fullWidth
            required
            error={touched && !!error}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>
    </Box>
  );
};
