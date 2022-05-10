import { useTranslation } from 'react-i18next';
import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import { Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography } from '@mui/material';

import { Registration } from '../../../../types/registration.types';
import { styled as muiStyled } from '@mui/system';

const StyledCenterWrapper = muiStyled('div')({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  marginBottom: '1rem',
  alignItems: 'center',
});

const StyledFormWrapper = muiStyled('div')({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '1rem',
  marginBottom: '1rem',
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
  // retrySearch: ()=>{}
}

export const DuplicateSearchFilterForm = ({ publication }: DuplicateSearchFilterFormProps) => {
  const { t } = useTranslation('basicData');

  const initialSearchParams = {
    doi: publication.entityDescription?.mainTitle ?? '', //publication.entityDescription?.reference?.doi ?? '',
    title: publication.entityDescription?.mainTitle ?? '',
    author: publication.entityDescription?.contributors[0]?.identity.name ?? '',
    yearPublished: '',
    issn: '',
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
        console.log('submitted', values);
      }}>
      {(formikProps: FormikProps<any>) => (
        <Form>
          <StyledFormWrapper>
            <FormGroup>
              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
                  name="isDoiChecked"
                  control={<Checkbox />}
                  label="DOI"
                  data-testid="duplicate-search-doi-checkbox"
                  onClick={(event: any) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isTitleChecked', false);
                      formikProps.setFieldValue('isAuthorChecked', false);
                      formikProps.setFieldValue('isIssnChecked', false);
                      formikProps.setFieldValue('isYearPublishedChecked', false);
                    }
                  }}
                />
                <Field name={'doi'}>
                  {({ field }: FieldProps) => (
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
                <Typography>eller søk på</Typography>
              </StyledCenterWrapper>

              <StyledFormElementWrapper>
                <Field
                  as={StyledFormControlLabel}
                  type="checkbox"
                  name="isTitleChecked"
                  control={<Checkbox />}
                  label="Tittel"
                  onClick={(event: any) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
                    }
                  }}
                />
                <Field name={'title'}>
                  {({ field }: FieldProps) => (
                    <TextField
                      data-testid="duplicate-search-title-textfield"
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
                  label="Søk med forfatter"
                  onClick={(event: any) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
                    }
                  }}
                />
                <Field name={'author'}>
                  {({ field }: FieldProps) => (
                    <TextField
                      data-testid="duplicate-search-author-textfield"
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
                  label="ISSN"
                  onClick={(event: any) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
                    }
                  }}
                />
                <Field name={'issn'}>
                  {({ field }: FieldProps) => (
                    <TextField
                      data-testid="duplicate-search-issn-textfield"
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
                  label="Publiseringsår"
                  onClick={(event: any) => {
                    if (event.target.value) {
                      formikProps.setFieldValue('isDoiChecked', false);
                    }
                  }}
                />
                <Field name={'yearPublished'}>
                  {({ field }: FieldProps) => (
                    <TextField
                      data-testid="duplicate-search-year-textfield"
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
                  data-testid="search-panel-reset-search-button"
                  variant="outlined"
                  color="primary"
                  onClick={() => formikProps.resetForm()}>
                  Tilbakestill søkeverdier
                </Button>
                <Button
                  style={{ marginLeft: '1rem' }}
                  data-testid="search-panel-retry-search-button"
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
                  Søk på nytt
                </Button>
              </StyledButtonWrapper>
            </FormGroup>
          </StyledFormWrapper>
        </Form>
      )}
    </Formik>
  );
};
