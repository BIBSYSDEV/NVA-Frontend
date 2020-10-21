import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ReportPublication } from '../../../../types/registration.types';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import { PublicationTableNumber } from '../../../../utils/constants';
import PublicationChannelSearch from '../components/PublicationChannelSearch';
import DoiField from '../components/DoiField';
import { Typography } from '@material-ui/core';
import SeriesRow from '../components/SeriesRow';
import PublisherField from '../components/PublisherField';
import IsbnListField from '../components/IsbnListField';
import TotalPagesField from '../components/TotalPagesField';

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

const StyledTypography = styled(Typography)`
  padding-top: 1.5rem;
`;

const ReportForm: FC = () => {
  const { t } = useTranslation('registration');

  const { setFieldValue, touched }: FormikProps<ReportPublication> = useFormikContext();

  return (
    <>
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
        <StyledTypography variant="h5">{t('references.series')}</StyledTypography>
        <Typography>{t('references.series_info')}</Typography>
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
    </>
  );
};

export default ReportForm;
