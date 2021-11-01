import { TextField, MenuItem, Typography, Button, ThemeProvider } from '@mui/material';
import {
  Field,
  FieldProps,
  ErrorMessage,
  FieldArray,
  FieldArrayRenderProps,
  useFormikContext,
  Formik,
  Form,
} from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../../../components/BackgroundDiv';
import { Modal } from '../../../../../components/Modal';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../../themes/lightTheme';
import {
  ArtisticRegistration,
  DesignType,
  Venue,
} from '../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';

const designTypes = Object.values(DesignType);

export const ArtisticDesignForm = () => {
  const { t } = useTranslation('registration');
  const { values } = useFormikContext<ArtisticRegistration>();

  return (
    <>
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

      <FieldArray name="entityDescription.reference.publicationContext.venues">
        {({ push, replace }: FieldArrayRenderProps) => (
          <>
            <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
              <Typography variant="h3">Visningssteder</Typography>
              <Button
                onClick={() => {
                  push({ name: '' });
                }}>
                Legg til visningssted
              </Button>

              {values.entityDescription.reference.publicationContext.venues?.map((venue, index) => (
                <VenueRow key={index} venue={venue} updateVenue={(newVenue) => replace(index, newVenue)} />
              ))}
            </BackgroundDiv>
          </>
        )}
      </FieldArray>
    </>
  );
};

interface VenueRowProps {
  venue: Venue;
  updateVenue: (venue: Venue) => void;
}

const VenueRow = ({ updateVenue, venue }: VenueRowProps) => {
  const [openAddVenue, setOpenAddVenue] = useState(false);

  return (
    <>
      <Typography>{venue.name}</Typography>
      <Button onClick={() => setOpenAddVenue(true)}>Rediger</Button>
      <ThemeProvider theme={lightTheme}>
        <Modal
          open={openAddVenue || !venue.name}
          onClose={() => setOpenAddVenue(false)}
          headingText="Legg til visningssted">
          <Formik
            initialValues={venue}
            onSubmit={(values) => {
              updateVenue(values);
              setOpenAddVenue(false);
            }}>
            {() => (
              <Form>
                <Field name="name">
                  {({ field, meta: { touched, error } }: FieldProps<string>) => (
                    <TextField
                      {...field}
                      variant="filled"
                      fullWidth
                      label={'Name'}
                      required
                      error={touched && !!error}
                      helperText={<ErrorMessage name={field.name} />}
                    />
                  )}
                </Field>
                <Button type="submit">Lagre</Button>
              </Form>
            )}
          </Formik>
        </Modal>
      </ThemeProvider>
    </>
  );
};
