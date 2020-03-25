import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { TextField } from '@material-ui/core';

import { FormikPublication, emptyPublisher } from '../../../types/publication.types';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import PublisherField from './components/PublisherField';

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  font-weight: bold;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  padding-top: 1.5rem;
`;

const ReportForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<FormikPublication> = useFormikContext();

  return (
    <>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(ReportType)} />

      <DoiField />

      <PublisherField
        fieldName={ReferenceFieldNames.PUBLISHER}
        label={t('common:publisher')}
        placeholder={t('references.search_for_publisher')}
      />

      <Field name={ReferenceFieldNames.ISBN}>
        {({ field }: FieldProps) => (
          <TextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
        )}
      </Field>
      <div>
        <Field name={ReferenceFieldNames.NUMBER_OF_PAGES}>
          {({ field }: FieldProps) => (
            <TextField
              data-testid="number_of_pages"
              variant="outlined"
              label={t('references.number_of_pages')}
              {...field}
            />
          )}
        </Field>
      </div>
      <StyledHeading>{t('references.series')}</StyledHeading>
      <StyledLabel>{t('references.series_info')}</StyledLabel>
      <Field name={ReferenceFieldNames.SERIES}>
        {({ field: { name, value } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-series"
              label={t('common:title')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={(inputValue) => setFieldValue(name, inputValue ?? emptyPublisher)}
              placeholder={t('references.search_for_series')}
            />
            {value.title && (
              <PublisherRow
                dataTestId="autosearch-results-series"
                label={t('common:title')}
                publisher={value}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default ReportForm;
