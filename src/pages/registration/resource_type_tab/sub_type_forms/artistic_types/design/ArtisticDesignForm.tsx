import {
  TextField,
  MenuItem,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormHelperText,
  Box,
} from '@mui/material';
import { Field, FieldProps, ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { StyledSelectWrapper } from '../../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import { ArtisticRegistration, DesignType } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { VenueModal } from './VenueModal';
import { OutputRow } from '../OutputRow';

const designTypes = Object.values(DesignType);

export const ArtisticDesignForm = () => {
  const { t } = useTranslation('registration');
  const { values, errors, touched } = useFormikContext<ArtisticRegistration>();
  const [openNewVenueModal, setOpenNewVenueModal] = useState(false);
  const { publicationInstance } = values.entityDescription.reference;
  const { subtype } = publicationInstance;
  const venues = publicationInstance.venues ?? [];

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
              value={field.value ?? ''}
              label={t('resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {designTypes.map((designType) => (
                <MenuItem value={designType} key={designType}>
                  {t(`resource_type.artistic.design_type.${designType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {subtype?.type === DesignType.Other && (
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

      <div>
        <Typography variant="h3" component="h2" gutterBottom>
          {t('resource_type.artistic.exhibition_places')}
        </Typography>
        <FieldArray name={ResourceFieldNames.Venues}>
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => (
            <>
              {venues.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('resource_type.artistic.exhibition_place')}</TableCell>
                      <TableCell>{t('common:order')}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {venues.map((venue, index) => (
                      <OutputRow
                        key={index}
                        item={venue}
                        updateItem={(newVenue) => replace(index, newVenue)}
                        removeItem={() => remove(index)}
                        moveItem={(newIndex) => move(index, newIndex)}
                        index={index}
                        maxIndex={venues.length - 1}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
              {!!touched.entityDescription?.reference?.publicationInstance?.venues &&
                typeof errors.entityDescription?.reference?.publicationInstance?.venues === 'string' && (
                  <Box mt="1rem">
                    <FormHelperText error>
                      <ErrorMessage name={name} />
                    </FormHelperText>
                  </Box>
                )}

              <Button
                data-testid={dataTestId.registrationWizard.resourceType.addVenueButton}
                onClick={() => setOpenNewVenueModal(true)}
                variant="outlined"
                sx={{ mt: '1rem' }}
                startIcon={<AddCircleOutlineIcon />}>
                {t('resource_type.artistic.add_exhibition_place')}
              </Button>
              <VenueModal
                onSubmit={(newVenue) => push(newVenue)}
                open={openNewVenueModal}
                closeModal={() => setOpenNewVenueModal(false)}
              />
            </>
          )}
        </FieldArray>
      </div>
    </>
  );
};
