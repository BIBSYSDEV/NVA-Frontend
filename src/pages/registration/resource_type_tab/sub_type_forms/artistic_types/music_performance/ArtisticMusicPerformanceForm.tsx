import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
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
import { ErrorMessage, FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArtisticRegistration,
  MusicOutput,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { OutputRow } from '../OutputRow';
import { AudioVisualPublicationModal } from './AudioVisualPublicationModal';
import { ConcertModal } from './ConcertModal';
import { MusicScoreModal } from './MusicScoreModal';
import { OtherPerformanceModal } from './OtherPerformanceModal';

type ArtisticMusicPerformanceModalType = '' | 'MusicScore' | 'AudioVisualPublication' | 'Concert' | 'OtherPerformance';

export const ArtisticMusicPerformanceForm = () => {
  const { t } = useTranslation();
  const { values, errors, touched } = useFormikContext<ArtisticRegistration>();
  const manifestations = values.entityDescription.reference.publicationInstance.manifestations ?? [];

  const [openModal, setOpenModal] = useState<ArtisticMusicPerformanceModalType>('');
  const closeModal = () => setOpenModal('');

  return (
    <div>
      <Typography variant="h3" component="h2" gutterBottom>
        {t('registration.resource_type.artistic.announcements')}
      </Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceManifestations}>
        {({ push, replace, remove, move, name }: FieldArrayRenderProps) => {
          const onAddOutput = (output: MusicOutput) => {
            output.sequence = manifestations.length + 1;
            push(output);
          };
          return (
            <>
              {manifestations.length > 0 && (
                <Table sx={{ '& th,td': { borderBottom: 1 } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.type')}</TableCell>
                      <TableCell>{t('common.description')}</TableCell>
                      <TableCell>{t('common.order')}</TableCell>
                      <TableCell>{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {manifestations.map((output, index) => (
                      <OutputRow
                        key={index}
                        item={output}
                        updateItem={(newManifestation) => replace(index, newManifestation)}
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

              <MusicScoreModal onSubmit={onAddOutput} open={openModal === 'MusicScore'} closeModal={closeModal} />
              <AudioVisualPublicationModal
                onSubmit={onAddOutput}
                open={openModal === 'AudioVisualPublication'}
                closeModal={closeModal}
              />
              <ConcertModal onSubmit={onAddOutput} open={openModal === 'Concert'} closeModal={closeModal} />
              <OtherPerformanceModal
                onSubmit={onAddOutput}
                open={openModal === 'OtherPerformance'}
                closeModal={closeModal}
              />

              <Box sx={{ mt: '1rem', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem' }}>
                <Button
                  onClick={() => setOpenModal('Concert')}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  data-testid={dataTestId.registrationWizard.resourceType.addConcertShowButton}>
                  {t('registration.resource_type.artistic.add_concert')}
                </Button>
                <Button
                  onClick={() => setOpenModal('AudioVisualPublication')}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  data-testid={dataTestId.registrationWizard.resourceType.addAudioVideoPublicationButton}>
                  {t('registration.resource_type.artistic.add_audio_visual_publication')}
                </Button>
                <Button
                  onClick={() => setOpenModal('MusicScore')}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  data-testid={dataTestId.registrationWizard.resourceType.addScoreManuscriptButton}>
                  {t('registration.resource_type.artistic.add_music_score')}
                </Button>
                <Button
                  onClick={() => setOpenModal('OtherPerformance')}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  data-testid={dataTestId.registrationWizard.resourceType.addOtherButton}>
                  {t('registration.resource_type.artistic.add_other_performance')}
                </Button>
              </Box>
            </>
          );
        }}
      </FieldArray>
    </div>
  );
};
