import { TextField } from '@mui/material';
import { ErrorMessage, Field, FieldProps, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../components/styled/Wrappers';
import { lightTheme } from '../../../themes/lightTheme';
import { PresentationType, ResourceFieldNames } from '../../../types/publicationFieldNames';
import { PresentationRegistration } from '../../../types/publication_types/presentationRegistration.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { SelectTypeField } from './components/SelectTypeField';

interface PresentationTypeFormProps {
  onChangeSubType: (type: string) => void;
}

export const PresentationTypeForm = ({ onChangeSubType }: PresentationTypeFormProps) => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<PresentationRegistration>();
  const subType = values.entityDescription.reference.publicationInstance.type;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.light}>
        <StyledSelectWrapper>
          <SelectTypeField
            fieldName={ResourceFieldNames.SubType}
            onChangeType={onChangeSubType}
            options={Object.values(PresentationType)}
          />
        </StyledSelectWrapper>
      </BackgroundDiv>

      {subType && (
        <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
          <Field name={ResourceFieldNames.PublicationContextLabel}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.eventTitleField}
                variant="filled"
                fullWidth
                label={t('resource_type.title_of_event')}
                {...field}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
          <Field name={'TODO'}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.eventOrganizerField}
                variant="filled"
                fullWidth
                label={t('resource_type.organizer')}
                {...field}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
          <Field name={ResourceFieldNames.PublicationContextPlaceLabel}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.eventPlaceField}
                variant="filled"
                fullWidth
                label={t('resource_type.place_for_event')}
                {...field}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
          <Field name={ResourceFieldNames.PublicationContextPlaceCountry}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.eventCountryield}
                variant="filled"
                fullWidth
                label={t('common:country')}
                {...field}
                error={touched && !!error}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
        </BackgroundDiv>
      )}
    </>
  );
};
