import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { DuplicateSearchFilters, DuplicateSearchForm } from '../../../../types/duplicateSearchTypes';
import { ImportCandidateSummary } from '../../../../types/importCandidate.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { isValidUrl } from '../../../../utils/general-helpers';

interface DuplicateSearchFilterFormProps {
  importCandidate: ImportCandidateSummary;
  setDuplicateSearchFilters: Dispatch<SetStateAction<DuplicateSearchFilters>>;
}

export const DuplicateSearchFilterForm = ({
  importCandidate,
  setDuplicateSearchFilters,
}: DuplicateSearchFilterFormProps) => {
  const { t } = useTranslation();

  const initialSearchParams: DuplicateSearchForm = {
    doi: importCandidate.doi ?? '',
    title: importCandidate.mainTitle ?? '',
    author: importCandidate.contributors[0]?.identity.name ?? '',
    issn: importCandidate.printIssn ?? importCandidate.onlineIssn ?? '',
    yearPublished: importCandidate.publicationYear ?? '',
    isDoiChecked: true,
    isTitleChecked: false,
    isAuthorChecked: false,
    isIssnChecked: false,
    isYearPublishedChecked: false,
  };

  return (
    <Formik
      initialValues={initialSearchParams}
      onSubmit={(values) => {
        setDuplicateSearchFilters({
          doi: values.isDoiChecked ? values.doi : '',
          title: values.isTitleChecked ? values.title : '',
          author: values.isAuthorChecked ? values.author : '',
          issn: values.isIssnChecked ? values.issn : '',
          yearPublished: values.isYearPublishedChecked ? values.yearPublished : '',
        });
      }}>
      {({ setFieldValue, values, resetForm }: FormikProps<DuplicateSearchForm>) => (
        <Form>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '0.5rem',
              my: '1rem',
            }}>
            <Field
              as={FormControlLabel}
              type="checkbox"
              id="doi-label"
              name="isDoiChecked"
              control={<Checkbox />}
              label={t('common.doi')}
              data-testid={dataTestId.basicData.centralImport.checkboxDoi}
              onClick={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value) {
                  setFieldValue('isTitleChecked', false);
                  setFieldValue('isAuthorChecked', false);
                  setFieldValue('isIssnChecked', false);
                  setFieldValue('isYearPublishedChecked', false);
                }
              }}
            />
            <Field name={'doi'}>
              {({ field }: FieldProps<string>) => (
                <Box sx={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <TextField
                    data-testid={dataTestId.basicData.centralImport.textFieldDoi}
                    variant="outlined"
                    {...field}
                    fullWidth
                    sx={{ flex: '1 20rem' }}
                    size="small"
                    multiline
                    disabled={!values.isDoiChecked}
                    slotProps={{ htmlInput: { 'aria-labelledby': 'doi-label' } }}
                  />
                  {field.value && isValidUrl(field.value) && (
                    <Button
                      variant="outlined"
                      endIcon={<OpenInNewIcon />}
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer">
                      {t('common.open')}
                    </Button>
                  )}
                </Box>
              )}
            </Field>

            <Typography sx={{ gridColumn: '1 / span 2', textAlign: 'center' }}>
              {t('basic_data.central_import.or_search_with')}
            </Typography>

            <Field
              as={FormControlLabel}
              type="checkbox"
              id="title-label"
              name="isTitleChecked"
              control={<Checkbox />}
              label={t('common.title')}
              data-testid={dataTestId.basicData.centralImport.checkboxTitle}
              onClick={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value) {
                  setFieldValue('isDoiChecked', false);
                }
              }}
            />
            <Field name={'title'}>
              {({ field }: FieldProps<string>) => (
                <TextField
                  data-testid={dataTestId.basicData.centralImport.textFieldTitle}
                  fullWidth
                  {...field}
                  variant="outlined"
                  size="small"
                  multiline
                  disabled={!values.isTitleChecked}
                  slotProps={{ htmlInput: { 'aria-labelledby': 'title-label' } }}
                />
              )}
            </Field>

            <Field
              as={FormControlLabel}
              type="checkbox"
              id="author-label"
              name="isAuthorChecked"
              control={<Checkbox />}
              label={t('basic_data.central_import.author')}
              data-testid={dataTestId.basicData.centralImport.checkboxAuthor}
              onClick={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value) {
                  setFieldValue('isDoiChecked', false);
                }
              }}
            />
            <Field name={'author'}>
              {({ field }: FieldProps<string>) => (
                <TextField
                  data-testid={dataTestId.basicData.centralImport.textFieldAuthor}
                  fullWidth
                  {...field}
                  variant="outlined"
                  size="small"
                  multiline
                  disabled={!values.isAuthorChecked}
                  slotProps={{ htmlInput: { 'aria-labelledby': 'author-label' } }}
                />
              )}
            </Field>

            <Field
              as={FormControlLabel}
              type="checkbox"
              id="issn-label"
              name="isIssnChecked"
              control={<Checkbox />}
              label={t('registration.resource_type.issn')}
              data-testid={dataTestId.basicData.centralImport.checkboxIssn}
              onClick={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value) {
                  setFieldValue('isDoiChecked', false);
                }
              }}
            />
            <Field name={'issn'}>
              {({ field }: FieldProps<string>) => (
                <TextField
                  data-testid={dataTestId.basicData.centralImport.textFieldIssn}
                  fullWidth
                  {...field}
                  variant="outlined"
                  size="small"
                  disabled={!values.isIssnChecked}
                  slotProps={{ htmlInput: { 'aria-labelledby': 'issn-label' } }}
                />
              )}
            </Field>

            <Field
              as={FormControlLabel}
              type="checkbox"
              id="year-label"
              name="isYearPublishedChecked"
              control={<Checkbox />}
              label={t('registration.year_published')}
              data-testid={dataTestId.basicData.centralImport.checkboxYear}
              onClick={(event: ChangeEvent<HTMLInputElement>) => {
                if (event.target.value) {
                  setFieldValue('isDoiChecked', false);
                }
              }}
            />
            <Field name={'yearPublished'}>
              {({ field }: FieldProps<string>) => (
                <TextField
                  data-testid={dataTestId.basicData.centralImport.textFieldYear}
                  fullWidth
                  {...field}
                  variant="outlined"
                  size="small"
                  disabled={!values.isYearPublishedChecked}
                  slotProps={{ htmlInput: { 'aria-labelledby': 'year-label' } }}
                />
              )}
            </Field>

            <Box sx={{ gridColumn: '1 / span 2', display: 'flex', gap: '1rem' }}>
              <Button
                data-testid={dataTestId.basicData.centralImport.resetButton}
                variant="outlined"
                color="primary"
                onClick={() => resetForm()}>
                {t('basic_data.central_import.reset_search_values')}
              </Button>
              <Button
                data-testid={dataTestId.basicData.centralImport.searchButton}
                variant="contained"
                type="submit"
                disabled={
                  !(
                    values.isYearPublishedChecked ||
                    values.isIssnChecked ||
                    values.isAuthorChecked ||
                    values.isTitleChecked ||
                    values.isDoiChecked
                  )
                }
                color="primary">
                {t('basic_data.central_import.search_again')}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
