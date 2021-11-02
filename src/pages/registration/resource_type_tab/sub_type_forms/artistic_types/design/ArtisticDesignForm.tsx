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
} from '@mui/material';
import { Field, FieldProps, ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../../../../components/BackgroundDiv';
import { StyledSelectWrapper } from '../../../../../../components/styled/Wrappers';
import { lightTheme } from '../../../../../../themes/lightTheme';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import { ArtisticRegistration, DesignType } from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { VenueModal } from './VenueModal';
import { VenueRow } from './VenueRow';

const designTypes = Object.values(DesignType);

export const ArtisticDesignForm = () => {
  const { t } = useTranslation('registration');
  const { values, errors, touched } = useFormikContext<ArtisticRegistration>();
  const [openNewVenueModal, setOpenNewVenueModal] = useState(false);
  const { venues } = values.entityDescription.reference.publicationContext;

  return (
    <>
      <BackgroundDiv backgroundColor={lightTheme.palette.section.main}>
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
          <Field name={ResourceFieldNames.PublicationInstanceSubtypeDescription}>
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

        <Field name={ResourceFieldNames.PublicationInstanceDescription}>
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

      <FieldArray name={ResourceFieldNames.Venues}>
        {({ push, replace, remove, name }: FieldArrayRenderProps) => (
          <>
            <BackgroundDiv backgroundColor={lightTheme.palette.section.dark}>
              <Typography variant="h3">{t('resource_type.exhibition_places')}</Typography>
              {venues.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('resource_type.exhibition_place')}</TableCell>
                      <TableCell>{t('common:date')}</TableCell>
                      <TableCell>{t('common:order')}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {values.entityDescription.reference.publicationContext.venues.map((venue, index) => (
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
              )}
              {!!touched.entityDescription?.reference?.publicationContext?.venues &&
                typeof errors.entityDescription?.reference?.publicationContext?.venues === 'string' && (
                  <FormHelperText error>
                    <ErrorMessage name={name} />
                  </FormHelperText>
                )}

              <Button onClick={() => setOpenNewVenueModal(true)} variant="outlined" sx={{ marginTop: '1rem' }}>
                {t('resource_type.add_venue')}
              </Button>
              <VenueModal
                venue={{
                  name: '',
                  place: { type: 'UnconfirmedPlace', label: '', country: '' },
                  time: { type: 'Period', from: '', to: '' },
                }}
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
