import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReportPublication, emptyPagesMonograph } from '../../../types/publication.types';
import { ReferenceFieldNames, ReportType } from '../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../utils/constants';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import DoiField from './components/DoiField';
import SelectTypeField from './components/SelectTypeField';
import SubHeading from '../../../components/SubHeading';
import Label from '../../../components/Label';
import SeriesRow from './components/SeriesRow';
import PublisherField from './components/PublisherField';
import IsbnListField from './components/IsbnListField';
import TotalPagesField from './components/TotalPagesField';

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

const ReportForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue, touched }: FormikProps<ReportPublication> = useFormikContext();

  useEffect(() => {
    // set correct Pages type based on publication type being Report
    setFieldValue(ReferenceFieldNames.PAGES, emptyPagesMonograph, false);
  }, [setFieldValue]);

  return (
    <StyledContent>
      <SelectTypeField fieldName={ReferenceFieldNames.SUB_TYPE} options={Object.values(ReportType)} />

      <DoiField />

      <PublisherField
        label={t('common:publisher')}
        placeholder={t('references.search_for_publisher')}
        touched={touched.entityDescription?.reference?.publicationContext?.publisher}
        errorName={ReferenceFieldNames.PUBLICATION_CONTEXT_PUBLISHER}
      />

      <StyledSection>
        <IsbnListField />
        <TotalPagesField />
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
