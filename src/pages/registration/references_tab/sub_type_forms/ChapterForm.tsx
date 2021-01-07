import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps } from 'formik';
import styled from 'styled-components';
import { TextField, Typography } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import RemoveIcon from '@material-ui/icons/Remove';
import { BookType, ChapterType, ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import NviValidation from '../components/NviValidation';
import DoiField from '../components/DoiField';
import Card from '../../../../components/Card';
import PeerReview from '../components/PeerReview';
import SearchContainerField from '../components/SearchContainerField';

const StyledInfoCard = styled(Card)`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  > :first-child {
    margin-right: 1rem;
  }
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

interface ChapterFormProps {
  subtype: ChapterType;
}

const ChapterForm = (props: ChapterFormProps) => {
  const { t } = useTranslation('registration');

  return (
    <>
      <StyledInfoCard>
        <InfoIcon color="primary" fontSize="large" />
        <Typography>{t('chapter.info')}</Typography>
      </StyledInfoCard>

      <DoiField />

      {props.subtype === ChapterType.BOOK && (
        <SearchContainerField
          fieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_LINKED_CONTEXT}
          searchSubtypes={[BookType.ANTHOLOGY]}
        />
      )}
      {/* {props.subtype === ChapterType.REPORT && <></>} */}

      <StyledPageNumberWrapper>
        <Field name={ReferenceFieldNames.PAGES_FROM}>
          {({ field }: FieldProps<string>) => (
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
          {({ field }: FieldProps<string>) => (
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

      {props.subtype === ChapterType.BOOK && (
        <>
          <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
          {/* TODO: Fix NVI validation */}
          <NviValidation isPeerReviewed={true} isRated={true} dataTestId="nvi-chapter" />
        </>
      )}
    </>
  );
};

export default ChapterForm;
