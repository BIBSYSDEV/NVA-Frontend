import { Field, FormikProps, useFormikContext } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';

import { Publication } from '../../../types/publication.types';
import { emptyPublisher, DegreeFieldNames } from '../../../types/references.types';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';
import { degreeTypes } from './../../../types/references.types';

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  font-weight: bold;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  padding-top: 1.5rem;
`;

const DegreeReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <Field name={DegreeFieldNames.TYPE}>
        {({ field }: any) => (
          <FormControl variant="outlined" fullWidth>
            <InputLabel>{t('common:type')}</InputLabel>
            <Select {...field}>
              {degreeTypes.map(type => (
                <MenuItem value={type.value} key={type.value}>
                  {t(type.label)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Field>

      <Field name={DegreeFieldNames.PUBLISHER}>
        {({ field: { name, value } }: any) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-publisher"
              label={t('references.publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              placeholder={t('references.search_for_publisher')}
            />
            {value.title && (
              <PublisherRow
                dataTestId="autosearch-results-publisher"
                label={t('references.publisher')}
                publisher={value}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>
      <StyledHeading>{t('references.series')}</StyledHeading>
      <StyledLabel>{t('references.series_info')}</StyledLabel>
      <Field name={DegreeFieldNames.SERIES}>
        {({ field: { name, value } }: any) => (
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

export default DegreeReferenceForm;
