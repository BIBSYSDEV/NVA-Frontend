import { Field, FormikProps, useFormikContext, FieldProps, ErrorMessage } from 'formik';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReportPublication } from '../../../types/publication.types';
import {
  ReferenceFieldNames,
  ReportType,
  PublicationType,
  contextTypeBaseFieldName,
} from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import SubHeading from '../../../components/SubHeading';
import Label from '../../../components/Label';
import { TextField } from '@material-ui/core';
import { BackendTypeNames } from '../../../types/publication_types/commonPublication.types';
import SeriesRow from './components/SeriesRow';

const StyledContent = styled.div`
  display: grid;
  gap: 1rem;
`;

const StyledSection = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-areas: 'isbn number-of-pages';
  grid-template-columns: 1fr 2fr;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'isbn' 'number-of-pages';
    grid-template-columns: 1fr;
  }
`;

const StyledTextField = styled(TextField)`
  display: inline;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    display: grid;
  }
`;

const ReportForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue, touched }: FormikProps<ReportPublication> = useFormikContext();

  useEffect(() => {
    // set correct Pages type based on publication type being Report
    setFieldValue(ReferenceFieldNames.PAGES_TYPE, BackendTypeNames.PAGES_MONOGRAPH);
  }, [setFieldValue]);

  return (
    <StyledContent>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(ReportType)} />

      <DoiField />

      <Field name={contextTypeBaseFieldName}>
        {({ field: { name, value }, meta: { error } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value.publisher === ''}
              dataTestId="autosearch-publisher"
              label={t('common:publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={(inputValue) => {
                setFieldValue(name, {
                  ...value,
                  publisher: inputValue.title,
                  level: inputValue.level,
                  url: inputValue.url,
                  type: PublicationType.REPORT,
                });
              }}
              placeholder={t('references.search_for_publisher')}
              errorMessage={
                error && touched.entityDescription?.reference?.publicationContext?.publisher ? (
                  // Must use global touched variable instead of what is in meta, since meta.touched always will
                  // evaluate to true if it is a object (as in this case). Even though this field will update
                  // the whole object, we only want to show error message if we are missing the title property.
                  <ErrorMessage name={ReferenceFieldNames.PUBLICATION_CONTEXT_TITLE} />
                ) : (
                  ''
                )
              }
            />
            {value.publisher && (
              <PublisherRow
                dataTestId="autosearch-results-publisher"
                label={t('common:publisher')}
                publisher={{ ...value, title: value.publisher }}
                onClickDelete={() =>
                  setFieldValue(name, { ...value, publisher: '', level: '', url: '', type: PublicationType.REPORT })
                }
              />
            )}
          </>
        )}
      </Field>

      <StyledSection>
        {/* TODO - convert to ISBN_LIST 
        <Field name={ReferenceFieldNames.ISBN}>
          {({ field }: FieldProps) => (
            <StyledTextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
          )}
        </Field> */}

        <Field name={ReferenceFieldNames.PAGES_PAGES}>
          {({ field }: FieldProps) => (
            <StyledTextField
              inputProps={{ 'data-testid': 'pages' }}
              variant="outlined"
              label={t('references.number_of_pages')}
              {...field}
              value={field.value ?? ''}
            />
          )}
        </Field>
      </StyledSection>
      <div>
        <SubHeading>{t('references.series')}</SubHeading>
        <Label>{t('references.series_info')}</Label>
        <Field name={ReferenceFieldNames.SERIES_TITLE}>
          {({ field: { name, value } }: FieldProps) => (
            <>
              <PublicationChannelSearch
                clearSearchField={value === ''}
                dataTestId="autosearch-series"
                label={t('common:title')}
                publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
                setValueFunction={(inputValue) => setFieldValue(name, inputValue.title ?? '')}
                placeholder={t('references.search_for_series')}
              />
              {value && (
                <SeriesRow
                  dataTestId="autosearch-results-series"
                  label={t('common:title')}
                  onClickDelete={() => setFieldValue(name, '')}
                  title={value ?? ''}
                />
              )}
            </>
          )}
        </Field>
      </div>
    </StyledContent>
  );
};

export default ReportForm;
