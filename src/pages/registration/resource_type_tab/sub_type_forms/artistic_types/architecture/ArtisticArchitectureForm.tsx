import {
  TextField,
  MenuItem,
  Box,
  Button,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Field, FieldProps, ErrorMessage, useFormikContext, FieldArray, FieldArrayRenderProps } from 'formik';
import { useTranslation } from 'react-i18next';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { StyledSelectWrapper } from '../../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import {
  ArtisticRegistration,
  ArchitectureType,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { useState } from 'react';
import { CompetitionModal } from './CompetitionModal';

const architectureTypes = Object.values(ArchitectureType);
type ArtisticArchitectureModalType = '' | 'Competition';

export const ArtisticArchitectureForm = () => {
  const { t } = useTranslation('registration');
  const { values, errors, touched } = useFormikContext<ArtisticRegistration>();

  const [openModal, setOpenModal] = useState<ArtisticArchitectureModalType>('');

  const { publicationInstance } = values.entityDescription.reference;
  const architectureOutput = publicationInstance.architectureOutput ?? [];

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
              label={t('resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {architectureTypes.map((designType) => (
                <MenuItem value={designType} key={designType}>
                  {t(`resource_type.architecture_type.${designType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {publicationInstance.subtype?.type === ArchitectureType.Other && (
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
        <Typography variant="h3">{t('resource_type.artistic.architecture_publications')}</Typography>
        <FieldArray name={ResourceFieldNames.ArchitectureOutput}>
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => (
            <>
              {architectureOutput.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('resource_type.offentliggjort gjennom')}</TableCell>
                      <TableCell>{t('common:date')}</TableCell>
                      <TableCell>{t('common:order')}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {architectureOutput.map(
                      (output, index) => null
                      // <VenueRow
                      //   key={index}
                      //   venue={venue}
                      //   updateVenue={(newVenue) => replace(index, newVenue)}
                      //   removeVenue={() => remove(index)}
                      //   moveVenue={(newIndex) => move(index, newIndex)}
                      //   index={index}
                      //   maxIndex={architectureOutput.length - 1}
                      // />
                    )}
                  </TableBody>
                </Table>
              )}
              {!!touched.entityDescription?.reference?.publicationInstance?.architectureOutput &&
                typeof errors.entityDescription?.reference?.publicationInstance?.architectureOutput === 'string' && (
                  <Box mt="1rem">
                    <FormHelperText error>
                      <ErrorMessage name={name} />
                    </FormHelperText>
                  </Box>
                )}

              <Button
                data-testid={dataTestId.registrationWizard.resourceType.addVenueButton}
                onClick={() => setOpenModal('Competition')}
                variant="outlined"
                sx={{ mt: '1rem' }}
                startIcon={<AddCircleOutlineIcon />}>
                {t('resource_type.artistic.add_competition')}
              </Button>
              <CompetitionModal
                competition={null}
                onSubmit={(newCompetition) => {
                  newCompetition.sequence = architectureOutput.length + 1;
                  push(newCompetition);
                }}
                open={openModal === 'Competition'}
                closeModal={() => setOpenModal('')}
              />
            </>
          )}
        </FieldArray>
      </div>
    </>
  );
};
