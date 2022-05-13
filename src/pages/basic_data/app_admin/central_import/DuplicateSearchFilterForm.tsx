import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { styled as muiStyled } from '@mui/system';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';
import { Registration } from '../../../../types/registration.types';
import { DuplicateSearchFilters, DuplicateSearchForm } from '../../../../types/duplicateSearchTypes';
import { dataTestId } from '../../../../utils/dataTestIds';

const StyledCenterWrapper = muiStyled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  marginBottom: '1rem',
  alignItems: 'center',
});

const StyledFormElementWrapper = muiStyled('div')({
  display: 'flex',
  marginBottom: '1rem',
});

const StyledFormControlLabel = muiStyled(FormControlLabel)({
  minWidth: '11rem',
});

const StyledButtonWrapper = muiStyled('div')({
  display: 'flex',
  justifyContent: 'flex-start',
  marginBottom: '1rem',
  alignItems: 'center',
});

interface DuplicateSearchFilterFormProps {
  publication: Registration;
  setDuplicateSearchFilters: Dispatch<SetStateAction<DuplicateSearchFilters>>;
}

export const DuplicateSearchFilterForm = ({
  publication,
  setDuplicateSearchFilters,
}: DuplicateSearchFilterFormProps) => {
  const { t } = useTranslation('basicData');

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
      {(formikProps: FormikProps<DuplicateSearchForm>) => (
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
                  label={t('central_import.doi')}
                  data-testid="duplicate-search-doi-checkbox"
                  onClick={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isTitleChecked', false);
                      formikProps.setFieldValue('isAuthorChecked', false);
                      formikProps.setFieldValue('isIssnChecked', false);
                      formikProps.setFieldValue('isYearPublishedChecked', false);
                    }
                  }}
                />
                <Field name={'doi'}>
                  {({ field }: FieldProps<string>) => (
                    <TextField
                      data-testid="duplicate-search-doi-textfield"
                      variant="outlined"
                      {...field}
                      fullWidth
                      multiline
                      disabled={!formikProps.values.isDoiChecked}
                    />
                  )}
                </Field>
              </StyledFormElementWrapper>

              <StyledCenterWrapper>
                <Typography>{t('central_import.or_search_with')}</Typography>
              </StyledCenterWrapper>

              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
                  name="isTitleChecked"
                  control={<Checkbox />}
                  label={t('central_import.title')}
                  onClick={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
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
                      disabled={!formikProps.values.isTitleChecked}
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
                  label={t('central_import.author')}
                  onClick={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
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
                      disabled={!formikProps.values.isAuthorChecked}
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
                  label={t('central_import.issn')}
                  onClick={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
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
                      disabled={!formikProps.values.isIssnChecked}
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
                  label={t('central_import.year_published')}
                  onClick={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
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
                      disabled={!formikProps.values.isYearPublishedChecked}
                    />
                  )}
                </Field>
              </StyledFormElementWrapper>

              <StyledButtonWrapper>
                <Button
                  data-testid={dataTestId.basicData.centralImport.resetButton}
                  variant="outlined"
                  color="primary"
                  onClick={() => formikProps.resetForm()}>
                  {t('central_import.reset_search_values')}
                </Button>
                <Button
                  style={{ marginLeft: '1rem' }}
                  data-testid={dataTestId.basicData.centralImport.searchButton}
                  variant="contained"
                  type="submit"
                  disabled={
                    !(
                      formikProps.values.isYearPublishedChecked ||
                      formikProps.values.isIssnChecked ||
                      formikProps.values.isAuthorChecked ||
                      formikProps.values.isTitleChecked ||
                      formikProps.values.isDoiChecked
                    )
                  }
                  color="primary">
                  {t('central_import.search_again')}
                </Button>
              </StyledButtonWrapper>
            </FormGroup>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
