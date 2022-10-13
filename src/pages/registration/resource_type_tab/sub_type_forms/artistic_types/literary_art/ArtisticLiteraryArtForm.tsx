import {
  Box,
  Button,
  FormHelperText,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Field, FieldProps, ErrorMessage, useFormikContext, FieldArray, FieldArrayRenderProps } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import {
  ArtisticRegistration,
  LiteraryArtsType,
  VisualArtType,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { VenueModal } from '../design/VenueModal';
import { OutputRow } from '../OutputRow';

const literaryArtTypes = Object.values(LiteraryArtsType);

export const ArtisticLiteraryArtForm = () => {
  const { t } = useTranslation();
  const { values, touched, errors } = useFormikContext<ArtisticRegistration>();
  const manifestations = values.entityDescription.reference.publicationInstance.manifestations ?? [];

  const [openNewVenueModal, setOpenNewVenueModal] = useState(false);

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
              label={t('registration.resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {literaryArtTypes.map((literaryArtType) => (
                <MenuItem value={literaryArtType} key={literaryArtType}>
                  {t(`registration.resource_type.artistic.literary_arts_type.${literaryArtType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {values.entityDescription.reference.publicationInstance.subtype?.type === VisualArtType.Other && (
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
              label={t('registration.resource_type.type_work_specified')}
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}
            />
          )}
        </Field>
      )}

      <div>
        <Typography variant="h3" component="h2" gutterBottom>
          {t('registration.resource_type.artistic.exhibition_places')}
        </Typography>
        <FieldArray name={ResourceFieldNames.PublicationInstanceManifestations}>
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => (
            <>
              {manifestations.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('registration.resource_type.artistic.exhibition_place')}</TableCell>
                      <TableCell>{t('common.order')}</TableCell>
                      <TableCell>{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {manifestations.map((venue, index) => (
                      <OutputRow
                        key={index}
                        item={venue}
                        updateItem={(newVenue) => replace(index, newVenue)}
                        removeItem={() => remove(index)}
                        moveItem={(newIndex) => move(index, newIndex)}
                        index={index}
                        maxIndex={manifestations.length - 1}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
              {!!touched.entityDescription?.reference?.publicationInstance?.manifestations &&
                typeof errors.entityDescription?.reference?.publicationInstance?.manifestations === 'string' && (
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
                {t('registration.resource_type.artistic.add_exhibition_place')}
              </Button>
              <VenueModal
                onSubmit={(newVenue) => push({ ...newVenue, type: 'Venue' })}
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
