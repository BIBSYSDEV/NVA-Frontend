import { Field, FormikProps, useFormikContext, FieldProps } from 'formik';
import React, { FC } from 'react';
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
import { Typography } from '@material-ui/core';

const StyledTypography = styled(Typography)`
  padding-top: 1.5rem;
`;

const DegreeForm: FC = () => {
  const { t } = useTranslation('publication');

  const { setFieldValue, touched }: FormikProps<DegreePublication> = useFormikContext();

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
    </>
  );
};

export default DegreeForm;
