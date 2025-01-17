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
import {
  ArtisticRegistration,
  FilmOutput,
  MovingPictureType,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { OutputRow } from '../OutputRow';
import { BroadcastModal } from './BroadcastModal';
import { CinematicReleaseModal } from './CinematicReleaseModal';
import { OtherReleaseModal } from './OtherReleaseModal';

const movingPictureTypes = Object.values(MovingPictureType);
type ArtisticMovingPictureModalType = '' | 'Broadcast' | 'CinematicRelease' | 'OtherRelease';

export const ArtisticMovingPictureForm = () => {
  const { t } = useTranslation();
  const { values, touched, errors } = useFormikContext<ArtisticRegistration>();
  const outputs = (values.entityDescription.reference.publicationInstance.outputs ?? []) as FilmOutput[];

  const [openModal, setOpenModal] = useState<ArtisticMovingPictureModalType>('');
  const closeModal = () => setOpenModal('');

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
              label={t('registration.resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {movingPictureTypes.map((movingPictureType) => (
                <MenuItem value={movingPictureType} key={movingPictureType}>
                  {t(`registration.resource_type.artistic.moving_picture_type.${movingPictureType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {values.entityDescription.reference.publicationInstance.subtype?.type === MovingPictureType.Other && (
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
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => {
            const onAddOutput = (output: FilmOutput) => {
              output.sequence = outputs.length + 1;
              push(output);
            };

            return (
              <>
                {outputs.length > 0 && (
                  <Table sx={{ '& th,td': { borderBottom: 1 } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.type')}</TableCell>
                        <TableCell>
                          {t('common.publisher')}/{t('common.place')}
                        </TableCell>
                        <TableCell>{t('common.order')}</TableCell>
                        <TableCell>{t('common.actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {outputs.map((output, index) => (
                        <OutputRow
                          key={index}
                          item={output}
                          updateItem={(newVenue) => replace(index, newVenue)}
                          removeItem={() => remove(index)}
                          moveItem={(newIndex) => move(index, newIndex)}
                          index={index}
                          maxIndex={outputs.length - 1}
                          showTypeColumn
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

                <BroadcastModal onSubmit={onAddOutput} open={openModal === 'Broadcast'} closeModal={closeModal} />
                <CinematicReleaseModal
                  onSubmit={onAddOutput}
                  open={openModal === 'CinematicRelease'}
                  closeModal={closeModal}
                />
                <OtherReleaseModal onSubmit={onAddOutput} open={openModal === 'OtherRelease'} closeModal={closeModal} />

                <Box sx={{ mt: '1rem', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem' }}>
                  <Button
                    onClick={() => setOpenModal('Broadcast')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    data-testid={dataTestId.registrationWizard.resourceType.addTvWebStreamingButton}>
                    {t('registration.resource_type.artistic.add_broadcast')}
                  </Button>
                  <Button
                    onClick={() => setOpenModal('CinematicRelease')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    data-testid={dataTestId.registrationWizard.resourceType.addFestivalCinemaButton}>
                    {t('registration.resource_type.artistic.add_cinematic_release')}
                  </Button>
                  <Button
                    onClick={() => setOpenModal('OtherRelease')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    data-testid={dataTestId.registrationWizard.resourceType.addOtherButton}>
                    {t('registration.resource_type.artistic.add_other_release')}
                  </Button>
                </Box>
              </>
            );
          }}
        </FieldArray>
      </div>
    </>
  );
};
