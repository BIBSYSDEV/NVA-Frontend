import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Publication } from '../../../types/publication.types';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import PublisherField from './components/PublisherField';
import SubHeading from '../../../components/SubHeading';
import Label from '../../../components/Label';
import { TextField } from '@material-ui/core';

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

  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  return (
    <StyledContent>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(ReportType)} />

      <DoiField />

      <PublisherField label={t('common:publisher')} placeholder={t('references.search_for_publisher')} />
      <StyledSection>
        {/* TODO - convert to ISBN_LIST 
        <Field name={ReferenceFieldNames.ISBN}>
          {({ field }: FieldProps) => (
            <StyledTextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
          )}
        </Field> */}

        <Field name={ReferenceFieldNames.PAGES}>
          {({ field }: FieldProps) => (
            <StyledTextField
              inputProps={{ 'data-testid': 'pages' }}
              variant="outlined"
              label={t('references.number_of_pages')}
              {...field}
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
                <PublisherRow
                  dataTestId="autosearch-results-series"
                  label={t('common:title')}
                  publisher={{ title: value }}
                  onClickDelete={() => setFieldValue(name, '')}
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
