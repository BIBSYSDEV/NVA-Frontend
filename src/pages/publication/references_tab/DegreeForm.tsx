import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Publication, emptyPublisher } from '../../../types/publication.types';
import {
  ReferenceFieldNames,
  DegreeType,
  contextTypeBaseFieldName,
  PublicationType,
} from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import PublisherRow from './components/PublisherRow';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  font-weight: bold;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  padding-top: 1.5rem;
`;

const DegreeForm: React.FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  useEffect(() => {
    // set correct Pages type based on publication type being Degree
    setFieldValue(ReferenceFieldNames.PAGES, null);
  }, [setFieldValue]);

  return (
    <>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(DegreeType)} />

      <DoiField />

      <Field name={contextTypeBaseFieldName}>
        {({ field: { name, value } }: FieldProps) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-publisher"
              label={t('common:publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={(inputValue) => {
                setFieldValue(name, { ...inputValue, publisher: inputValue.title, type: PublicationType.DEGREE });
              }}
              placeholder={t('references.search_for_publisher')}
            />
            {value.publisher && (
              <PublisherRow
                dataTestId="autosearch-results-publisher"
                label={t('common:publisher')}
                publisher={{ ...value, title: value.publisher }}
                onClickDelete={() => setFieldValue(name, emptyPublisher)}
              />
            )}
          </>
        )}
      </Field>

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

export default DegreeForm;
