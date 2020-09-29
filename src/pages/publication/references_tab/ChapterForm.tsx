import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, FormikProps, useFormikContext } from 'formik';
import { TextField, Typography, Button } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import styled from 'styled-components';
import RemoveIcon from '@material-ui/icons/Remove';
import { ReferenceFieldNames } from '../../../types/publicationFieldNames';
import NviValidation from './components/NviValidation';
import DoiField from './components/DoiField';
import { ChapterPublication } from '../../../types/publication.types';
import PeerReview from './components/PeerReview';
import { ChapterEntityDescription } from '../../../types/publication_types/bookPublication.types';
import AutoSearch from '../../../components/AutoSearch';
import useSearchPublications from '../../../utils/hooks/useSearchPublications';
import Card from '../../../components/Card';

const StyledInfoBox = styled.div`
  margin-top: 1rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  padding: 1rem 0;
  display: flex;
  align-items: center;
`;

const StyledIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.palette.text.secondary};
  margin: 1rem;
  font-size: 2rem;
`;

const StyledPageNumberWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledDashIconWrapper = styled.div`
  margin-right: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
`;

const StyledPageNumberField = styled(TextField)`
  margin-right: 1rem;
  width: 10rem;
`;

const StyledCard = styled(Card)`
  display: grid;
  grid-template-areas: 'title textbook .' 'publisher level button';
  grid-template-columns: 2fr 2fr 1fr;
  gap: 1rem;
`;

const StyledTitle = styled.div`
  grid-area: title;
`;

const StyledTextBook = styled.div`
  grid-area: textbook;
  align-self: end;
`;

const StyledPublisher = styled.div`
  grid-area: publisher;
`;

const StyledLevel = styled.div`
  grid-area: level;
`;

const StyledButtonWrapper = styled.div`
  grid-area: button;
  justify-self: end;
  align-self: end;
`;

const ChapterForm: FC = () => {
  const { t } = useTranslation('publication');
  const [searchTerm, setSearchTerm] = useState('');
  const [publications] = useSearchPublications(searchTerm); // TODO: filter by Book
  const { values }: FormikProps<ChapterPublication> = useFormikContext();
  const {
    reference: {
      // publicationContext: { linkedContext }, TODO: show linkedContext
      publicationInstance: { peerReviewed },
    },
  } = values.entityDescription as ChapterEntityDescription;

  return (
    <>
      <StyledInfoBox>
        <StyledIcon />
        {t('chapter.info')}
      </StyledInfoBox>

      <DoiField />

      <Field name={ReferenceFieldNames.LINKED_CONTEXT}>
        {({ field: { name, value }, form: { setFieldValue }, meta: { error } }: FieldProps) => (
          <>
            <AutoSearch
              clearSearchField
              dataTestId="search-for-book"
              onInputChange={(value) => setSearchTerm(value)}
              searchResults={publications}
              setValueFunction={(value) => {
                console.log('value', value);
                setFieldValue(name, value);
                // todo: lookup this publication to find textBookContent, publisher, level, ISBN
              }}
              label="search for book"
              placeholder="search for book"
              errorMessage={error}
            />

            {value && (
              <StyledCard data-testid="autosearch-results-book">
                <StyledTitle>
                  <Typography>{t('common:title')}</Typography>
                  <Typography variant="h4">{value.title}</Typography>
                </StyledTitle>
                <StyledTextBook>
                  <Typography>Lærebok</Typography>
                  <Typography variant="h6">Ja, boken er en lærebok</Typography>
                </StyledTextBook>
                <StyledPublisher>
                  <Typography>Publisher</Typography>
                  <Typography variant="h6">Cappelen</Typography>
                </StyledPublisher>
                <StyledLevel>
                  <Typography>Level</Typography>
                  <Typography variant="h6">1</Typography>
                </StyledLevel>
                <StyledButtonWrapper>
                  <Button
                    data-testid="remove-book"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      setFieldValue(name, '');
                    }}>
                    {t('common:remove')}
                  </Button>
                </StyledButtonWrapper>
              </StyledCard>
            )}
          </>
        )}
      </Field>

      {/* TODO <BookSearch /> */}

      <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />

      <StyledPageNumberWrapper>
        <Field name={ReferenceFieldNames.PAGES_FROM}>
          {({ field }: FieldProps) => (
            <StyledPageNumberField
              variant="outlined"
              data-testid="chapter-pages-from"
              label={t('references.pages_from')}
              {...field}
              value={field.value ?? ''}
            />
          )}
        </Field>
        <StyledDashIconWrapper>
          <RemoveIcon />
        </StyledDashIconWrapper>
        <Field name={ReferenceFieldNames.PAGES_TO}>
          {({ field }: FieldProps) => (
            <StyledPageNumberField
              data-testid="chapter-pages-to"
              variant="outlined"
              label={t('references.pages_to')}
              {...field}
              value={field.value ?? ''}
            />
          )}
        </Field>
      </StyledPageNumberWrapper>

      <NviValidation isPeerReviewed={peerReviewed} isRated={false} dataTestId="nvi-chapter" />
    </>
  );
};

export default ChapterForm;
