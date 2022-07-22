import { useState } from 'react';
import {
  TextField,
  MenuItem,
  Box,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material';
import { Field, FieldProps, ErrorMessage, useFormikContext, FieldArray, FieldArrayRenderProps } from 'formik';
import { useTranslation } from 'react-i18next';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { StyledSelectWrapper } from '../../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import {
  ArtisticRegistration,
  FilmOutput,
  MovingPictureType,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { OutputRow } from '../OutputRow';
import { BroadcastModal } from './BroadcastModal';
import { CinematicReleaseModal } from './CinematicReleaseModal';
import { OtherReleaseModal } from './OtherReleaseModal';

const movingPictureTypes = Object.values(MovingPictureType);
type ArtisticMovingPictureModalType = '' | 'Broadcast' | 'CinematicRelease' | 'OtherRelease';

export const ArtisticMovingPictureForm = () => {
  const { t } = useTranslation('registration');
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
              label={t('resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {movingPictureTypes.map((movingPictureType) => (
                <MenuItem value={movingPictureType} key={movingPictureType}>
                  {t(`resource_type.artistic.moving_picture_type.${movingPictureType}`)}
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
          {t('resource_type.artistic.announcements')}
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
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('translations:common.type')}</TableCell>
                        <TableCell>
                          {t('translations:common.publisher')}/{t('translations:common.place')}
                        </TableCell>
                        <TableCell>{t('translations:common.order')}</TableCell>
                        <TableCell></TableCell>
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

                <Box sx={{ mt: '1rem', display: 'flex', gap: '1rem' }}>
                  <Button
                    onClick={() => setOpenModal('Broadcast')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}>
                    {t('resource_type.artistic.add_broadcast')}
                  </Button>
                  <Button
                    onClick={() => setOpenModal('CinematicRelease')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}>
                    {t('resource_type.artistic.add_cinematic_release')}
                  </Button>
                  <Button
                    onClick={() => setOpenModal('OtherRelease')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}>
                    {t('resource_type.artistic.add_other_release')}
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
