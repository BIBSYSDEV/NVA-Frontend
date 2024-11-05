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
import { StyledSelectWrapper } from '../../../../../components/styled/Wrappers';
import { ResourceFieldNames } from '../../../../../types/publicationFieldNames';
import {
  ExhibitionProductionSubtype,
  ExhibitionRegistration,
} from '../../../../../types/publication_types/exhibitionContent.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { OutputRow } from '../artistic_types/OutputRow';
import { ExhibitionBasicModal } from './ExhibitionBasicModal';
import { ExhibitionCatalogModal } from './ExhibitionCatalogModal';

const exhibitionSubtypes = Object.values(ExhibitionProductionSubtype);
type ExhibitionProductioModalType = '' | 'ExhibitionBasic' | 'ExhibitionCatalog';

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
              {exhibitionSubtypes.map((exhibitionSubtype) => (
                <MenuItem value={exhibitionSubtype} key={exhibitionSubtype}>
                  {t(`registration.resource_type.exhibition_production.subtype.${exhibitionSubtype}`)}
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
                      <TableCell>{t('common.description')}</TableCell>
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
                  <FormHelperText error>
                    <ErrorMessage name={name} />
                  </FormHelperText>
                )}

              <Box sx={{ display: 'flex', gap: '1rem', mt: '1rem' }}>
                <Button
                  data-testid={dataTestId.registrationWizard.resourceType.addExhibitionBasicButton}
                  onClick={() => setOpenModal('ExhibitionBasic')}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}>
                  {t('registration.resource_type.exhibition_production.add_exhibition_basic')}
                </Button>
                <Button
                  data-testid={dataTestId.registrationWizard.resourceType.addExhibitionCatalogButton}
                  onClick={() => setOpenModal('ExhibitionCatalog')}
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}>
                  {t('registration.resource_type.exhibition_production.add_exhibition_catalog')}
                </Button>
              </Box>

              <ExhibitionBasicModal
                onSubmit={(newExhibitionBasic) => push(newExhibitionBasic)}
                open={openModal === 'ExhibitionBasic'}
                closeModal={() => setOpenModal('')}
              />
              <ExhibitionCatalogModal
                onSubmit={(newExhibitionCatalog) => push(newExhibitionCatalog)}
                open={openModal === 'ExhibitionCatalog'}
                closeModal={() => setOpenModal('')}
              />
            </>
          )}
        </FieldArray>
      </div>
    </>
  );
};
