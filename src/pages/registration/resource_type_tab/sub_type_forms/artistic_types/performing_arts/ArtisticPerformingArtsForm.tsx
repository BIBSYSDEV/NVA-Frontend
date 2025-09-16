import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
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
import { ErrorMessage, Field, FieldArray, FieldArrayRenderProps, FieldProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../../../components/styled/Wrappers';
import { alternatingTableRowColor } from '../../../../../../themes/mainTheme';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import {
  ArtisticRegistration,
  PerformingArtType,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { OutputRow } from '../OutputRow';
import { VenueModal } from '../design/VenueModal';

const performingArtTypes = Object.values(PerformingArtType);

export const ArtisticPerformingArtsForm = () => {
  const { t } = useTranslation();
  const { values, touched, errors } = useFormikContext<ArtisticRegistration>();
  const outputs = values.entityDescription.reference.publicationInstance.outputs ?? [];

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
              {performingArtTypes.map((performingArtType) => (
                <MenuItem value={performingArtType} key={performingArtType}>
                  {t(`registration.resource_type.artistic.performing_arts_type.${performingArtType}`)}
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
      <Field name={ResourceFieldNames.PublicationInstanceDescription}>
        {({ field, meta: { error, touched } }: FieldProps<string>) => (
          <TextField
            id={field.name}
            data-testid={dataTestId.registrationWizard.resourceType.artisticDescriptionField}
            variant="filled"
            fullWidth
            {...field}
            multiline
            label={t('registration.resource_type.more_info_about_work')}
            error={!!error && touched}
            helperText={<ErrorMessage name={field.name} />}
          />
        )}
      </Field>

      <div>
        <Typography variant="h3" component="h2" gutterBottom>
          {t('registration.resource_type.artistic.announcements')}
        </Typography>
        <FieldArray name={ResourceFieldNames.PublicationInstanceOutputs}>
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => (
            <>
              {outputs.length > 0 && (
                <Table sx={alternatingTableRowColor}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.order')}</TableCell>
                      <TableCell>{t('common.place')}</TableCell>
                      <TableCell>{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {outputs.map((venue, index) => (
                      <OutputRow
                        key={index}
                        item={venue}
                        updateItem={(newVenue) => replace(index, newVenue)}
                        removeItem={() => remove(index)}
                        moveItem={(newIndex) => move(index, newIndex)}
                        index={index}
                        maxIndex={outputs.length - 1}
                      />
                    ))}
                  </TableBody>
                </Table>
              )}
              {!!touched.entityDescription?.reference?.publicationInstance?.outputs &&
                typeof errors.entityDescription?.reference?.publicationInstance?.outputs === 'string' && (
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
                {t('registration.resource_type.artistic.add_announcement')}
              </Button>
              <VenueModal
                onSubmit={(newVenue) => push({ ...newVenue, type: 'PerformingArtsVenue' })}
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
