import { Field, FormikProps, useFormikContext, FieldProps, ErrorMessage } from 'formik';
import React, { useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { DegreePublication } from '../../../types/publication.types';
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
import SeriesRow from './components/SeriesRow';

const StyledLabel = styled.div`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
  font-weight: bold;
`;

const StyledHeading = styled.div`
  font-size: 1.5rem;
  padding-top: 1.5rem;
`;

const DegreeForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue, touched }: FormikProps<DegreePublication> = useFormikContext();

  useEffect(() => {
    // set correct Pages type based on publication type being Degree
    setFieldValue(ReferenceFieldNames.PAGES, null);
  }, [setFieldValue]);

  return (
    <>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(DegreeType)} />

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
                  type: PublicationType.DEGREE,
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
                onClickDelete={() => {
                  setFieldValue(name, { ...value, publisher: '', level: '', url: '', type: PublicationType.DEGREE });
                }}
              />
            )}
          </>
        )}
      </Field>

      <StyledHeading>{t('references.series')}</StyledHeading>
      <StyledLabel>{t('references.series_info')}</StyledLabel>
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
    </>
  );
};

export default DegreeForm;
