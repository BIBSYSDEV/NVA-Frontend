import React from 'react';
import { useTranslation } from 'react-i18next';
import { Field, FieldProps, useFormikContext } from 'formik';
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
import { ChapterRegistration } from '../../../../types/registration.types';

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

const ChapterForm = () => {
  const { t } = useTranslation('registration');

  const { values } = useFormikContext<ChapterRegistration>();
  const {
    reference: { publicationContext, publicationInstance },
  } = values.entityDescription;

  return (
    <>
      <StyledInfoCard>
        <InfoIcon color="primary" fontSize="large" />
        <Typography>{t('chapter.info')}</Typography>
      </StyledInfoCard>

      <DoiField />

      {publicationInstance.type === ChapterType.BOOK && (
        <SearchContainerField
          fieldName={ReferenceFieldNames.PUBLICATION_CONTEXT_LINKED_CONTEXT}
          searchSubtypes={[BookType.ANTHOLOGY]}
        />
      )}

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

      {publicationInstance.type === ChapterType.BOOK && (
        <>
          <PeerReview fieldName={ReferenceFieldNames.PEER_REVIEW} label={t('references.peer_review')} />
          <NviValidation
            isPeerReviewed={!!publicationInstance.peerReviewed}
            isRated={!!publicationContext?.level}
            dataTestId="nvi-chapter"
          />
        </>
      )}
    </>
  );
};

export default ChapterForm;
