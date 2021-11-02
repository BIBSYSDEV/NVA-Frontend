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
  DialogActions,
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
  const [openNewVenueModal, setOpenNewVenueModal] = useState(false);

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
        <Field name={'entityDescription.reference.publicationInstance.designType.type'}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <StyledSelectWrapper>
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.artisticTypeField}
                select
                variant="filled"
                fullWidth
                {...field}
                label={t('resource_type.design_type_label')}
                required
                error={!!error && touched}
                helperText={<ErrorMessage name={field.name} />}>
                {designTypes.map((designType) => (
                  <MenuItem value={designType} key={designType}>
                    {t(`resource_type.design_type.${designType}`)}
                  </MenuItem>
                ))}
              </TextField>
            </StyledSelectWrapper>
          )}
        </Field>

        {values.entityDescription.reference.publicationInstance.subtype.type === DesignType.Other && (
          <Field name={'entityDescription.reference.publicationInstance.designType.description'}>
            {({ field, meta: { error, touched } }: FieldProps<string>) => (
              <TextField
                id={field.name}
                data-testid={dataTestId.registrationWizard.resourceType.artisticOtherTypeField}
                variant="filled"
                fullWidth
                {...field}
                multiline
                label={t('resource_type.design_type.Other')}
                error={!!error && touched}
                helperText={<ErrorMessage name={field.name} />}
              />
            )}
          </Field>
        )}

        <Field name={'entityDescription.reference.publicationInstance.description'}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
              id={field.name}
              data-testid={dataTestId.registrationWizard.resourceType.artisticMoreInfoField}
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
      </BackgroundDiv>

      <FieldArray name="entityDescription.reference.publicationContext.venues">
        {({ push, replace, remove }: FieldArrayRenderProps) => (
          <>
            <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
              <Typography variant="h3">{t('resource_type.exhibition_places')}</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('resource_type.exhibition_place')}</TableCell>
                    <TableCell>{t('common:order')}</TableCell>
                    <TableCell></TableCell>
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
              <Button onClick={() => setOpenNewVenueModal(true)} variant="outlined" sx={{ marginTop: '1rem' }}>
                {t('resource_type.add_venue')}
              </Button>
              <VenueModal
                venue={{ name: '' }}
                onSubmit={(newVenue) => push(newVenue)}
                open={openNewVenueModal}
                closeModal={() => setOpenNewVenueModal(false)}
              />
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
  const { t } = useTranslation('common');
  const [openEditVenue, setOpenEditVenue] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <Typography>{venue.name}</Typography>
      </TableCell>
      <TableCell>{index}</TableCell>
      <TableCell>
        <Button onClick={() => setOpenEditVenue(true)} variant="outlined" sx={{ marginRight: '1rem' }}>
          {t('edit')}
        </Button>
        <Button onClick={removeVenue} variant="contained" color="error">
          {t('remove')}
        </Button>
      </TableCell>
      <VenueModal
        venue={venue}
        onSubmit={updateVenue}
        open={openEditVenue}
        closeModal={() => setOpenEditVenue(false)}
      />
    </TableRow>
  );
};

interface VenueModalProps {
  venue: Venue;
  onSubmit: (venue: Venue) => void;
  open: boolean;
  closeModal: () => void;
}

const VenueModal = ({ venue, onSubmit, open, closeModal }: VenueModalProps) => {
  const { t } = useTranslation('registration');

  return (
    <ThemeProvider theme={lightTheme}>
      <Modal open={open} onClose={closeModal} headingText={t('resource_type.add_venue')}>
        <Formik
          initialValues={venue}
          onSubmit={(values) => {
            onSubmit(values);
            closeModal();
          }}>
          {() => (
            <Form>
              <Field name="name">
                {({ field, meta: { touched, error } }: FieldProps<string>) => (
                  <TextField
                    {...field}
                    variant="filled"
                    fullWidth
                    label={t('common:name')}
                    required
                    error={touched && !!error}
                    helperText={<ErrorMessage name={field.name} />}
                  />
                )}
              </Field>
              <DialogActions>
                <Button variant="outlined" color="inherit" onClick={closeModal}>
                  {t('common:cancel')}
                </Button>
                <Button variant="contained" type="submit">
                  {t('common:save')}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Modal>
    </ThemeProvider>
  );
};
