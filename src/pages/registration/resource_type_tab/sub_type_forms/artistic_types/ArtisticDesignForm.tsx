import {
  TextField,
  MenuItem,
  Typography,
  Button,
  ThemeProvider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
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
        {({ push, replace, remove }: FieldArrayRenderProps) => (
          <>
            <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
              <Typography variant="h3">Visningssteder</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Visningssted</TableCell>
                    <TableCell>Rekkefølge</TableCell>
                    <TableCell>Handlinger</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {values.entityDescription.reference.publicationContext.venues?.map((venue, index) => (
                    <VenueRow
                      key={index}
                      venue={venue}
                      updateVenue={(newVenue) => replace(index, newVenue)}
                      removeVenue={() => remove(index)}
                      index={index}
                    />
                  ))}
                </TableBody>
              </Table>
              <Button
                onClick={() => {
                  push({ name: '' });
                }}
                variant="outlined"
                sx={{ marginTop: '1rem' }}>
                Legg til visningssted
              </Button>
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
  removeVenue: () => void;
  index: number;
}

const VenueRow = ({ updateVenue, removeVenue, venue, index }: VenueRowProps) => {
  const [openAddVenue, setOpenAddVenue] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Typography>{venue.name}</Typography>
      </TableCell>
      <TableCell>{index}</TableCell>
      <TableCell>
        <Button onClick={() => setOpenAddVenue(true)} variant="outlined" sx={{ marginRight: '1rem' }}>
          Rediger
        </Button>
        <Button onClick={removeVenue} variant="contained" color="error">
          Fjern
        </Button>
      </TableCell>

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
    </TableRow>
  );
};
