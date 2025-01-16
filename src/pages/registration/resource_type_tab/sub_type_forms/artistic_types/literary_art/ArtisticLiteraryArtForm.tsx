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
  LiteraryArtsOutput,
  LiteraryArtsType,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { OutputRow } from '../OutputRow';
import { LiteraryArtsAudioVisualModal } from './LiteraryArtsAudioVisualModal';
import { LiteraryArtsMonographModal } from './LiteraryArtsMonographModal';
import { LiteraryArtsPerformanceModal } from './LiteraryArtsPerformanceModal';
import { LiteraryArtsWebPublicationModal } from './LiteraryArtsWebPublicationModal';

const literaryArtTypes = Object.values(LiteraryArtsType);
type ArtisticArchitectureModalType =
  | ''
  | 'LiteraryArtsMonograph'
  | 'LiteraryArtsWeb'
  | 'LiteraryArtsPerformance'
  | 'LiteraryArtsAudioVisual';

export const ArtisticLiteraryArtForm = () => {
  const { t } = useTranslation();
  const { values, touched, errors } = useFormikContext<ArtisticRegistration>();
  const manifestations = values.entityDescription.reference.publicationInstance.manifestations ?? [];

  const [openNewManifestationModal, setOpenNewManifestationModal] = useState<ArtisticArchitectureModalType>('');

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
              {literaryArtTypes.map((literaryArtType) => (
                <MenuItem value={literaryArtType} key={literaryArtType}>
                  {t(`registration.resource_type.artistic.literary_arts_type.${literaryArtType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {values.entityDescription.reference.publicationInstance.subtype?.type === LiteraryArtsType.Other && (
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

      <div>
        <Typography variant="h3" component="h2" gutterBottom>
          {t('registration.resource_type.artistic.announcements')}
        </Typography>
        <FieldArray name={ResourceFieldNames.PublicationInstanceManifestations}>
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => {
            const onAddManifestation = (manifestation: LiteraryArtsOutput) => push(manifestation);

            return (
              <>
                {manifestations.length > 0 && (
                  <Table sx={{ '& th,td': { borderBottom: 1 } }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('common.type')}</TableCell>
                        <TableCell>{t('registration.resource_type.artistic.publisher')}</TableCell>
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
                          showTypeColumn
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

                <Box sx={{ mt: '1rem', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem' }}>
                  <Button
                    data-testid={dataTestId.registrationWizard.resourceType.addBookButton}
                    onClick={() => setOpenNewManifestationModal('LiteraryArtsMonograph')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}>
                    {t('registration.resource_type.artistic.add_book')}
                  </Button>
                  <Button
                    data-testid={dataTestId.registrationWizard.resourceType.addAudioVideoButton}
                    onClick={() => setOpenNewManifestationModal('LiteraryArtsAudioVisual')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}>
                    {t('registration.resource_type.artistic.add_audio_visual_publication')}
                  </Button>
                  <Button
                    data-testid={dataTestId.registrationWizard.resourceType.addPerformanceButton}
                    onClick={() => setOpenNewManifestationModal('LiteraryArtsPerformance')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}>
                    {t('registration.resource_type.artistic.add_performance')}
                  </Button>
                  <Button
                    data-testid={dataTestId.registrationWizard.resourceType.addWebPublicationButton}
                    onClick={() => setOpenNewManifestationModal('LiteraryArtsWeb')}
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}>
                    {t('registration.resource_type.artistic.add_web_publication')}
                  </Button>
                </Box>
                <LiteraryArtsMonographModal
                  onSubmit={onAddManifestation}
                  open={openNewManifestationModal === 'LiteraryArtsMonograph'}
                  closeModal={() => setOpenNewManifestationModal('')}
                />
                <LiteraryArtsPerformanceModal
                  onSubmit={onAddManifestation}
                  open={openNewManifestationModal === 'LiteraryArtsPerformance'}
                  closeModal={() => setOpenNewManifestationModal('')}
                />
                <LiteraryArtsAudioVisualModal
                  onSubmit={onAddManifestation}
                  open={openNewManifestationModal === 'LiteraryArtsAudioVisual'}
                  closeModal={() => setOpenNewManifestationModal('')}
                />
                <LiteraryArtsWebPublicationModal
                  onSubmit={onAddManifestation}
                  open={openNewManifestationModal === 'LiteraryArtsWeb'}
                  closeModal={() => setOpenNewManifestationModal('')}
                />
              </>
            );
          }}
        </FieldArray>
      </div>
    </>
  );
};
