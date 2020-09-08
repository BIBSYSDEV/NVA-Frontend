import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DegreePublication } from '../../../types/publication.types';
import { ReferenceFieldNames, DegreeType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import SeriesRow from './components/SeriesRow';
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

      <PublisherField
        label={t('common:publisher')}
        placeholder={t('references.search_for_publisher')}
        touched={touched.entityDescription?.reference?.publicationContext?.publisher}
        errorName={ReferenceFieldNames.PUBLICATION_CONTEXT_PUBLISHER}
      />

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
