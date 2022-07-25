import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { styled as muiStyled } from '@mui/system';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';
import { Registration } from '../../../../types/registration.types';
import { DuplicateSearchFilters, DuplicateSearchForm } from '../../../../types/duplicateSearchTypes';
import { dataTestId } from '../../../../utils/dataTestIds';

const StyledFormElementWrapper = muiStyled('div')({
  display: 'flex',
  marginBottom: '1rem',
});

const StyledFormControlLabel = muiStyled(FormControlLabel)({
  minWidth: '11rem',
});

interface DuplicateSearchFilterFormProps {
  publication: Registration;
  setDuplicateSearchFilters: Dispatch<SetStateAction<DuplicateSearchFilters>>;
}

export const DuplicateSearchFilterForm = ({
  publication,
  setDuplicateSearchFilters,
}: DuplicateSearchFilterFormProps) => {
  const { t } = useTranslation();

  const initialSearchParams: DuplicateSearchForm = {
    doi: publication.entityDescription?.reference?.doi ?? '',
    title: publication.entityDescription?.mainTitle ?? '',
    author: publication.entityDescription?.contributors[0]?.identity.name ?? '',
    issn: '',
    yearPublished: '',
    isDoiChecked: true,
    isTitleChecked: false,
    isAuthorChecked: false,
    isIssnChecked: false,
    isYearPublishedChecked: false,
  };

  //TODO: Bruker bør ikke kunne søke med tomme verdier i avsjekkede felter.
  //TODO: Implementer tester ;-)

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
              display: 'flex',
              flexDirection: 'column',
              marginTop: '1rem',
              marginBottom: '1rem',
            }}>
            <FormGroup>
              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
                  name="isDoiChecked"
                  control={<Checkbox />}
                  label={t('basic_data.central_import.doi')}
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
                    <TextField
                      data-testid={dataTestId.basicData.centralImport.textFieldDoi}
                      variant="outlined"
                      {...field}
                      fullWidth
                      multiline
                      disabled={!values.isDoiChecked}
                    />
                  )}
                </Field>
              </StyledFormElementWrapper>

              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                  alignItems: 'center',
                }}>
                <Typography>{t('basic_data.central_import.or_search_with')}</Typography>
              </Box>

              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
                  name="isTitleChecked"
                  control={<Checkbox />}
                  label={t('basic_data.central_import.title')}
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
                      disabled={!values.isTitleChecked}
                      multiline
                    />
                  )}
                </Field>
              </StyledFormElementWrapper>

              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
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
                      disabled={!values.isAuthorChecked}
                      multiline
                    />
                  )}
                </Field>
              </StyledFormElementWrapper>

              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
                  name="isIssnChecked"
                  control={<Checkbox />}
                  label={t('basic_data.central_import.issn')}
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
                      disabled={!values.isIssnChecked}
                    />
                  )}
                </Field>
              </StyledFormElementWrapper>

              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
                  name="isYearPublishedChecked"
                  control={<Checkbox />}
                  label={t('basic_data.central_import.year_published')}
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
                      disabled={!values.isYearPublishedChecked}
                    />
                  )}
                </Field>
              </StyledFormElementWrapper>

              <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '1rem', alignItems: 'center' }}>
                <Button
                  data-testid={dataTestId.basicData.centralImport.resetButton}
                  variant="outlined"
                  color="primary"
                  onClick={() => resetForm()}>
                  {t('basic_data.central_import.reset_search_values')}
                </Button>
                <Button
                  style={{ marginLeft: '1rem' }}
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
            </FormGroup>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
