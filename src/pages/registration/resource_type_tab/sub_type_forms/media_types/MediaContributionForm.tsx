import { Box, MenuItem, TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import { MediaFormat, MediaMedium } from '../../../../../types/publication_types/mediaContributionRegistration.types';

export const MediaContributionForm = () => {
  const { t } = useTranslation();

  return (
    <StyledSelectWrapper>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Field name={ResourceFieldNames.PublicationContextMediaMedium}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              variant="filled"
              select
              required
              label={t('registration.resource_type.media_contribution.medium')}
              fullWidth
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}>
              {Object.values(MediaMedium).map((medium) => (
                <MenuItem key={medium} value={medium}>
                  {t(`registration.resource_type.media_contribution.medium_types.${medium}`)}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Field>

        <Field name={ResourceFieldNames.PublicationContextMediaFormat}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              variant="filled"
              select
              required
              label={t('registration.resource_type.media_contribution.format')}
              fullWidth
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}>
              {Object.values(MediaFormat).map((format) => (
                <MenuItem key={format} value={format}>
                  {t(`registration.resource_type.media_contribution.format_types.${format}`)}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Field>

        <Field name={ResourceFieldNames.PublicationContextMediaChannel}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              variant="filled"
              required
              label={t('registration.resource_type.media_contribution.channel')}
              fullWidth
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
        <Field name={ResourceFieldNames.PublicationContextMediaPartOfSeries}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              variant="filled"
              label={t('registration.resource_type.media_contribution.name_of_series_program')}
              fullWidth
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
        <Field name={ResourceFieldNames.PublicationContextMediaPartOfSeriesPart}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              variant="filled"
              label={t('registration.resource_type.media_contribution.name_of_issue_episode')}
              fullWidth
              {...field}
              error={touched && !!error}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      </Box>
    </StyledSelectWrapper>
  );
};
