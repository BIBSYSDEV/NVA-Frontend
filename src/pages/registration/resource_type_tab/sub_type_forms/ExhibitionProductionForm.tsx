import { TextField, MenuItem } from '@mui/material';
import { Field, FieldProps, ErrorMessage, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../types/publicationFieldNames';
import {
  ExhibitionProductionSubtype,
  ExhibitionRegistration,
} from '../../../../types/publication_types/exhibitionContent.types';
import { dataTestId } from '../../../../utils/dataTestIds';

const exhibitionSubtypes = Object.values(ExhibitionProductionSubtype);

export const ExhibitionProductionForm = () => {
  const { t } = useTranslation();
  const { values } = useFormikContext<ExhibitionRegistration>();
  const { publicationInstance } = values.entityDescription.reference;
  const { subtype } = publicationInstance;

  return (
    <>
      <Field name={ResourceFieldNames.PublicationInstanceSubtypeType}>
        {({ field, meta: { error, touched } }: FieldProps<ExhibitionProductionSubtype | ''>) => (
          <StyledSelectWrapper>
            <TextField
              data-testid={dataTestId.registrationWizard.resourceType.subtypeField}
              select
              variant="filled"
              fullWidth
              {...field}
              label={t('registration.resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {exhibitionSubtypes.map((exhibitionType) => (
                <MenuItem value={exhibitionType} key={exhibitionType}>
                  {t(`registration.resource_type.exhibition_production_subtype.${exhibitionType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {subtype?.type === ExhibitionProductionSubtype.Other && (
        <Field name={ResourceFieldNames.PublicationInstanceSubtypeDescription}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              data-testid={dataTestId.registrationWizard.resourceType.subtypeDescriptionField}
              variant="filled"
              fullWidth
              {...field}
              required
              multiline
              label={t('registration.resource_type.type_work_specified')}
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      )}
    </>
  );
};
