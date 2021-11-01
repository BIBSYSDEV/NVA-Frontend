import { TextField, MenuItem } from '@mui/material';
import { Field, FieldProps, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../../themes/lightTheme';
import { DesignType } from '../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';

const designTypes = Object.values(DesignType);

export const ArtisticDesignForm = () => {
  const { t } = useTranslation('registration');

  return (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
      <Field name={'subType'}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <StyledSelectWrapper>
            <TextField
              id={field.name}
              data-testid={dataTestId.registrationWizard.resourceType.artisticTypeField}
              select
              variant="filled"
              fullWidth
              {...field}
              label={'Designtype'}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {designTypes.map((designType) => (
                <MenuItem value={designType} key={designType}>
                  {t(`resource_type.designType.${designType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      <Field name={'description'}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.artisticMoreInfoField}
            variant="filled"
            fullWidth
            {...field}
            multiline
            label={'Mer informasjon'}
            error={!!error && touched}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>
    </BackgroundDiv>
  );
};
