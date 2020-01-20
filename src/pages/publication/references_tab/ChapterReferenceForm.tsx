import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FormikProps, useFormikContext } from 'formik';
import {
  emptyPublisher,
  JournalArticleFieldNames,
  ReportFieldNames,
  reportTypes,
} from '../../../types/references.types';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import PublicationChannelSearch from './components/PublicationChannelSearch';
import { PublicationTableNumber } from '../../../utils/constants';
import PublisherRow from './components/PublisherRow';
import InfoIcon from '@material-ui/icons/Info';
import { Publication } from '../../../types/publication.types';
import styled from 'styled-components';
import RemoveIcon from '@material-ui/icons/Remove';

const ChapterReferenceForm: React.FC = () => {
  const { t } = useTranslation('publication');

  const StyledInfoBox = styled.div`
    margin-top: 1rem;
    background-color: ${({ theme }) => theme.palette.background.default};
    padding: 1rem 0;
  `;

  const StyledIcon = styled(InfoIcon)`
    color: grey; //todo
    margin: 1rem;
    font-size: 2rem;
  `;

  const StyledPageNumberWrapper = styled.div`
    display: flex;
  `;
  const StyledDashIcon = styled(RemoveIcon)`
    width: 3rem;
    color: grey; //todo:
    font-size: 2rem;
  `;

  const StyledPageNumberField = styled(TextField)`
    margin-right: 1rem;
    width: 10rem;
  `;

  const { setFieldValue }: FormikProps<Publication> = useFormikContext();

  return (
    <>
      <StyledInfoBox>
        <StyledIcon />
        <span>{t('chapter.info')}</span>
      </StyledInfoBox>

      <Field name={ReportFieldNames.PUBLISHER}>
        {({ field: { name, value } }: any) => (
          <>
            <PublicationChannelSearch
              clearSearchField={value === emptyPublisher}
              dataTestId="autosearch-publisher"
              label={t('references.publisher')}
              publicationTable={PublicationTableNumber.PUBLISHERS}
              setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}
              value={value.title}
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
      <StyledPageNumberWrapper>
        <Field name={JournalArticleFieldNames.PAGES_FROM}>
          {({ field }: any) => (
            <StyledPageNumberField variant="outlined" label={t('references.pages_from')} {...field} />
          )}
        </Field>
        <StyledDashIcon />
        <Field name={JournalArticleFieldNames.PAGES_TO}>
          {({ field }: any) => <StyledPageNumberField variant="outlined" label={t('references.pages_to')} {...field} />}
        </Field>
      </StyledPageNumberWrapper>

      {/*<StyledHeading>{t('references.series')}</StyledHeading>*/}
      {/*<StyledLabel>{t('references.series_info')}</StyledLabel>*/}
      {/*<Field name={ReportFieldNames.SERIES}>*/}
      {/*  {({ field: { name, value } }: any) => (*/}
      {/*    <>*/}
      {/*      <PublicationChannelSearch*/}
      {/*        clearSearchField={value === emptyPublisher}*/}
      {/*        dataTestId="autosearch-series"*/}
      {/*        label={t('common:title')}*/}
      {/*        publicationTable={PublicationTableNumber.PUBLICATION_CHANNELS}*/}
      {/*        setValueFunction={inputValue => setFieldValue(name, inputValue ?? emptyPublisher)}*/}
      {/*        value={value.title}*/}
      {/*        placeholder={t('references.search_for_series')}*/}
      {/*      />*/}
      {/*      {value.title && (*/}
      {/*        <PublisherRow*/}
      {/*          dataTestId="autosearch-results-series"*/}
      {/*          label={t('common:title')}*/}
      {/*          publisher={value}*/}
      {/*          onClickDelete={() => setFieldValue(name, emptyPublisher)}*/}
      {/*        />*/}
      {/*      )}*/}
      {/*    </>*/}
      {/*  )}*/}
      {/*</Field>*/}
    </>
  );
};

export default ChapterReferenceForm;
