import { Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { lightTheme } from '../../../../themes/lightTheme';
import { BookType, JournalType } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { BookMonographContentType, JournalArticleContentType } from '../../../../types/publication_types/content.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Journal, Publisher, Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface NviValidationProps {
  registration: Registration;
}

export const NviValidation = ({ registration }: NviValidationProps) => {
  const { publicationInstance } = registration.entityDescription.reference;

  const isNviApplicableJournalArticle =
    publicationInstance.type === JournalType.Article &&
    'contentType' in publicationInstance &&
    (publicationInstance.contentType === JournalArticleContentType.ResearchArticle ||
      publicationInstance.contentType === JournalArticleContentType.ReviewArticle);

  const isNviApplicableBookMonograph =
    publicationInstance.type === BookType.Monograph &&
    'contentType' in publicationInstance &&
    publicationInstance.contentType === BookMonographContentType.AcademicMonograph;

  return isNviApplicableJournalArticle || isNviApplicableBookMonograph ? (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.black}>
      {isNviApplicableJournalArticle ? (
        <NviValidationJournalArticle registration={registration as JournalRegistration} />
      ) : isNviApplicableBookMonograph ? (
        <NviValidationBookMonograph registration={registration as BookRegistration} />
      ) : null}
    </BackgroundDiv>
  ) : null;
};

const NviValidationJournalArticle = ({ registration }: { registration: JournalRegistration }) => {
  const { t } = useTranslation('registration');
  const { publicationContext, publicationInstance } = registration.entityDescription.reference;

  const publicationChannelState = useSelector((store: RootStore) => store.publicationChannel);
  const journal = publicationContext.id ? (publicationChannelState[publicationContext.id] as Journal) : null;
  const isRatedJournal = parseInt(journal?.level ?? '0') > 0;

  const isPeerReviewed = !!publicationInstance.peerReviewed;

  return (
    <Typography
      data-testid={
        isRatedJournal && isPeerReviewed
          ? dataTestId.registrationWizard.resourceType.nviSuccess
          : dataTestId.registrationWizard.resourceType.nviFailed
      }>
      {isRatedJournal
        ? isPeerReviewed
          ? t('resource_type.nvi.applicable')
          : t('resource_type.nvi.not_peer_reviewed')
        : t('resource_type.nvi.channel_not_rated')}
    </Typography>
  );
};

const NviValidationBookMonograph = ({ registration }: { registration: BookRegistration }) => {
  const { t } = useTranslation('registration');
  const { publicationContext, publicationInstance } = registration.entityDescription.reference;

  const publicationChannelState = useSelector((store: RootStore) => store.publicationChannel);
  const publisher = publicationContext.publisher?.id
    ? (publicationChannelState[publicationContext.publisher.id] as Publisher)
    : null;
  const series = publicationContext.series?.id
    ? (publicationChannelState[publicationContext.series.id] as Journal)
    : null;

  const isRatedPublisher = parseInt(publisher?.level ?? '0') > 0;
  const isRatedSeries = parseInt(series?.level ?? '0') > 0;
  const isRated = series?.id ? isRatedSeries : isRatedPublisher;

  const isPeerReviewed = !!publicationInstance.peerReviewed;

  return (
    <Typography
      data-testid={
        isRated && isPeerReviewed
          ? dataTestId.registrationWizard.resourceType.nviSuccess
          : dataTestId.registrationWizard.resourceType.nviFailed
      }>
      {isRated
        ? isPeerReviewed
          ? t('resource_type.nvi.applicable')
          : t('resource_type.nvi.not_peer_reviewed')
        : t('resource_type.nvi.channel_not_rated')}
    </Typography>
  );
};
