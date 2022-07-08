import { MenuItem, TextField } from '@mui/material';
import { Field, FieldProps, ErrorMessage, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import {
  ArtisticRegistration,
  PerformingArtType,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';

const performingArtTypes = Object.values(PerformingArtType);

export const ArtisticPerformingArtsForm = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<ArtisticRegistration>();

  return (
    <>
      <Field name={ResourceFieldNames.PublicationInstanceSubtypeType}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <StyledSelectWrapper>
            <TextField
              id={field.name}
              data-testid={dataTestId.registrationWizard.resourceType.artisticTypeField}
              select
              variant="filled"
              fullWidth
              {...field}
              label={t('resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {performingArtTypes.map((performingArtType) => (
                <MenuItem value={performingArtType} key={performingArtType}>
                  {t(`resource_type.artistic.performing_arts_type.${performingArtType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {values.entityDescription.reference.publicationInstance.subtype?.type === PerformingArtType.Other && (
        <Field name={ResourceFieldNames.PublicationInstanceSubtypeDescription}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              id={field.name}
              data-testid={dataTestId.registrationWizard.resourceType.artisticOtherTypeField}
              variant="filled"
              fullWidth
              {...field}
              required
              multiline
              label={t('resource_type.type_work_specified')}
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      )}
      <Field name={ResourceFieldNames.PublicationInstanceDescription}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.artisticDescriptionField}
            variant="filled"
            fullWidth
            {...field}
            multiline
            label={t('resource_type.more_info_about_work')}
            error={!!error && touched}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>
    </>
  );
};
