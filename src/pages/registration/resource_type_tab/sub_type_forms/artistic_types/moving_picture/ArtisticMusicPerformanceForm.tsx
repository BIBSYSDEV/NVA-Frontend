import { Typography, Table, TableHead, TableRow, TableCell, TableBody, Box, FormHelperText } from '@mui/material';
import { FieldArray, FieldArrayRenderProps, ErrorMessage, useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';
import { ResourceFieldNames } from '../../../../../../types/publicationFieldNames';
import { ArtisticRegistration } from '../../../../../../types/publication_types/artisticRegistration.types';
import { OutputRow } from '../OutputRow';

export const ArtisticMusicPerformanceForm = () => {
  const { t } = useTranslation('registration');
  const { values, errors, touched } = useFormikContext<ArtisticRegistration>();
  const manifestations = values.entityDescription.reference.publicationInstance.manifestations ?? [];

  return (
    <div>
      <Typography variant="h3" component="h2" gutterBottom>
        {t('resource_type.artistic.announcements')}
      </Typography>
      <FieldArray name={ResourceFieldNames.PublicationInstanceManifestations}>
        {({ push, replace, remove, move, name }: FieldArrayRenderProps) => {
          return (
            <>
              {manifestations.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('common:type')}</TableCell>
                      <TableCell>
                        {t('common:publisher')}/{t('common:place')}
                      </TableCell>
                      <TableCell>{t('common:order')}</TableCell>
                      <TableCell></TableCell>
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
            </>
          );
        }}
      </FieldArray>
    </div>
  );
};
