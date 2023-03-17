import {
  TextField,
  MenuItem,
  Typography,
  Box,
  Button,
  FormHelperText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Field, FieldProps, ErrorMessage, useFormikContext, FieldArray, FieldArrayRenderProps } from 'formik';
import { useTranslation } from 'react-i18next';
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import {
  ExhibitionProductionSubtype,
  ExhibitionRegistration,
} from '../../../../../types/publication_types/exhibitionContent.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { useState } from 'react';
import { ExhibitionBasicModal } from './ExhibitionBasicModal';
import { OutputRow } from '../artistic_types/OutputRow';

const exhibitionSubtypes = Object.values(ExhibitionProductionSubtype);
type ExhibitionProductioModalType = '' | 'ExhibitionBasic';

export const ExhibitionProductionForm = () => {
  const { t } = useTranslation();
  const { values, errors, touched } = useFormikContext<ExhibitionRegistration>();
  const { subtype, manifestations } = values.entityDescription.reference.publicationInstance;

  const [openModal, setOpenModal] = useState<ExhibitionProductioModalType>('');

  return (
    <>
      <Field name={ResourceFieldNames.PublicationInstanceSubtypeType}>
        {({ field, meta: { error, touched } }: FieldProps<ExhibitionProductionSubtype | ''>) => (
          <StyledSelectWrapper>
            <TextField
              data-testid={dataTestId.registrationWizard.resourceType.subtypeField}
              select
              variant="filled"
              fullWidth
              {...field}
              label={t('registration.resource_type.type_work')}
              required
              error={!!error && touched}
              helperText={<ErrorMessage name={field.name} />}>
              {exhibitionSubtypes.map((exhibitionType) => (
                <MenuItem value={exhibitionType} key={exhibitionType}>
                  {t(`registration.resource_type.exhibition_production.subtype.${exhibitionType}`)}
                </MenuItem>
              ))}
            </TextField>
          </StyledSelectWrapper>
        )}
      </Field>

      {subtype?.type === ExhibitionProductionSubtype.Other && (
        <Field name={ResourceFieldNames.PublicationInstanceSubtypeDescription}>
          {({ field, meta: { error, touched } }: FieldProps<string>) => (
            <TextField
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
          {({ push, replace, remove, move, name }: FieldArrayRenderProps) => (
            <>
              {manifestations.length > 0 && (
                <Table sx={{ '& th,td': { borderBottom: 1 } }}>
                  <TableHead>
                    <TableRow sx={{ '& th,td': { borderBottom: 1 } }}>
                      <TableCell>{t('common.type')}</TableCell>
                      <TableCell>{t('registration.resource_type.artistic.exhibition_place')}</TableCell>
                      <TableCell>{t('common.order')}</TableCell>
                      <TableCell>{t('common.actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {manifestations.map((manifestation, index) => (
                      <OutputRow
                        key={index}
                        item={manifestation}
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

              <Button
                data-testid={dataTestId.registrationWizard.resourceType.addExhibitionBasicButton}
                onClick={() => setOpenModal('ExhibitionBasic')}
                variant="outlined"
                sx={{ mt: '1rem' }}
                startIcon={<AddCircleOutlineIcon />}>
                {t('registration.resource_type.artistic.add_exhibition_place')}
              </Button>
              <ExhibitionBasicModal
                onSubmit={(newExhibitionBasic) => push(newExhibitionBasic)}
                open={openModal === 'ExhibitionBasic'}
                closeModal={() => setOpenModal('')}
              />
            </>
          )}
        </FieldArray>
      </div>
    </>
  );
};
