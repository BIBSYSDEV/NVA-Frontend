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
  ArchitectureOutput,
  ArchitectureType,
  ArtisticRegistration,
} from '../../../../../../types/publication_types/artisticRegistration.types';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import { dataTestId } from '../../../../../../utils/dataTestIds';
import { OutputRow } from '../OutputRow';
import { AwardModal } from './AwardModal';
import { CompetitionModal } from './CompetitionModal';
import { ExhibitionModal } from './ExhibitionModal';
import { PublicationMentionModal } from './PublicationMentionModal';

const architectureTypes = Object.values(ArchitectureType);
type ArtisticArchitectureModalType = '' | 'Competition' | 'MentionInPublication' | 'Award' | 'Exhibition';

export const ArtisticArchitectureForm = () => {
  const { t } = useTranslation();
  const { values, errors, touched } = useFormikContext<ArtisticRegistration>();

  const [openModal, setOpenModal] = useState<ArtisticArchitectureModalType>('');

  const { publicationInstance } = values.entityDescription.reference;
  const architectureOutput = (publicationInstance.architectureOutput ?? []) as ArchitectureOutput[];

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
              {architectureTypes.map((architectureType) => (
                <MenuItem value={architectureType} key={architectureType}>
                  {t(`registration.resource_type.artistic.architecture_type.${architectureType}`)}
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
        <FieldArray name={ResourceFieldNames.PublicationInstanceArchitectureOutput}>
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => (
            <>
              {architectureOutput.length > 0 && (
                <Table sx={{ '& th,td': { borderBottom: 1 } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common.type')}</TableCell>
                      <TableCell>{t('registration.resource_type.artistic.name_or_title')}</TableCell>
                      <TableCell>{t('common.order')}</TableCell>
                      <TableCell>{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {architectureOutput.map((output, index) => (
                      <OutputRow
                        key={index}
                        item={output}
                        updateItem={(newItem) => replace(index, newItem)}
                        removeItem={() => remove(index)}
                        moveItem={(newIndex) => move(index, newIndex)}
                        index={index}
                        maxIndex={architectureOutput.length - 1}
                        showTypeColumn
                      />
                    ))}
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

              <CompetitionModal
                onSubmit={(newCompetition) => {
                  newCompetition.sequence = architectureOutput.length + 1;
                  push(newCompetition);
                }}
                open={openModal === 'Competition'}
                closeModal={() => setOpenModal('')}
              />
              <PublicationMentionModal
                onSubmit={(newMention) => {
                  newMention.sequence = architectureOutput.length + 1;
                  push(newMention);
                }}
                open={openModal === 'MentionInPublication'}
                closeModal={() => setOpenModal('')}
              />
              <AwardModal
                onSubmit={(newAward) => {
                  newAward.sequence = architectureOutput.length + 1;
                  push(newAward);
                }}
                open={openModal === 'Award'}
                closeModal={() => setOpenModal('')}
              />
              <ExhibitionModal
                onSubmit={(newExhibition) => {
                  newExhibition.sequence = architectureOutput.length + 1;
                  push(newExhibition);
                }}
                open={openModal === 'Exhibition'}
                closeModal={() => setOpenModal('')}
              />
            </>
          )}
        </FieldArray>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '1rem', mt: '0.5rem' }}>
          <Button
            data-testid={dataTestId.registrationWizard.resourceType.addCompetitionButton}
            onClick={() => setOpenModal('Competition')}
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}>
            {t('registration.resource_type.artistic.add_competition')}
          </Button>
          <Button
            data-testid={dataTestId.registrationWizard.resourceType.addMentionInPublicationButton}
            onClick={() => setOpenModal('MentionInPublication')}
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}>
            {t('registration.resource_type.artistic.add_publication_mention')}
          </Button>
          <Button
            data-testid={dataTestId.registrationWizard.resourceType.addAwardButton}
            onClick={() => setOpenModal('Award')}
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}>
            {t('registration.resource_type.artistic.add_award')}
          </Button>
          <Button
            data-testid={dataTestId.registrationWizard.resourceType.addExhibitionButton}
            onClick={() => setOpenModal('Exhibition')}
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}>
            {t('registration.resource_type.artistic.add_exhibition')}
          </Button>
        </Box>
      </div>
    </>
  );
};
