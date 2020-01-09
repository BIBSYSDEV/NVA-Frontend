import { Field, FormikProps, useFormikContext } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';

import { PublicationTableNumber } from '../../../utils/constants';
import JournalPublisherRow from './components/JournalPublisherRow';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import { emptyPublisher, ReportFieldNames, reportTypes } from '../../../types/references.types';
import { Publication } from '../../../types/publication.types';

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
        {({ field }: any) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t('common:type')}</InputLabel>
            <Select {...field}>
              {reportTypes.map(type => (
                <MenuItem value={type.value} key={type.value}>
                  {t(type.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Field>

      <Field name={ReportFieldNames.PUBLISHER}>
        {({ field: { name, value } }: any) => (
          <>
            <div data-testid="autosearch-publisher">
              <PublicationChannelSearch
                clearSearchField={value === emptyPublisher}
                label={t('references.publisher')}
                publicationTable={PublicationTableNumber.PUBLISHERS}
                setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              />
            </div>
            {value.title && (
              <div data-testid="autosearch-results-publisher">
                <JournalPublisherRow
                  hidePublisher
                  label={t('references.publisher')}
                  publisher={value}
                  onClickDelete={() => setFieldValue(name, emptyPublisher)}
                />
              </div>
            )}
          </>
        )}
      </Field>
      <div>
        <Field name={ReportFieldNames.ISBN}>
          {({ field }: any) => (
            <TextField data-testid="isbn" variant="outlined" label={t('references.isbn')} {...field} />
          )}
        </Field>
      </div>
      <div>
        <Field name={ReportFieldNames.NUMBER_OF_PAGES}>
          {({ field }: any) => (
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
        {({ field: { name, value } }: any) => (
          <>
            <div data-testid="autosearch-series">
              <PublicationChannelSearch
                clearSearchField={value === emptyPublisher}
                label={t('common:title')}
                publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}
                setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              />
            </div>
            {value.title && (
              <div data-testid="autosearch-results-series">
                <JournalPublisherRow
                  hidePublisher
                  label={t('common:title')}
                  publisher={value}
                  onClickDelete={() => setFieldValue(name, emptyPublisher)}
                />
              </div>
            )}
          </>
        )}
      </Field>
    </>
  );
};

export default ReportReferenceForm;
