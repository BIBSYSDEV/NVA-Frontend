import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { MenuItem, TextField } from '@material-ui/core';

import { Publication } from '../../../types/publication.types';
import { emptyPublisher, ReportFieldNames, ReportType } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  font-weight: bold;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  padding-top: 1.5rem;
`;

const ReportReferenceForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Field name={ReportFieldNames.TYPE}>
        {({ field }: FieldProps) => (
          <TextField select variant="outlined" fullWidth label={t('common:type')} {...field}>
            {Object.values(ReportType).map(typeValue => (
              <MenuItem value={typeValue} key={typeValue}>
                {t(`referenceTypes:subtypes_report.${typeValue}`)}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Field>

      <Field name={ReportFieldNames.PUBLISHER}>
        {({ field: { name, value } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-publisher"
              label={t('common:publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              placeholder={t('references.search_for_publisher')}
            />
            {value.title && (
              <PublisherRow
                dataTestId="autosearch-results-publisher"
                label={t('common:publisher')}
                publisher={value}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
      <Field name={ReportFieldNames.ISBN}>
        {({ field }: FieldProps) => (
          <TextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
        )}
      </Field>
      <div>
        <Field name={ReportFieldNames.NUMBER_OF_PAGES}>
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
      <Field name={ReportFieldNames.SERIES}>
        {({ field: { name, value } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-series"
              label={t('common:title')}
              publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
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

export default ReportReferenceForm;
