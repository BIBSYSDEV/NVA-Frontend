import { Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { lightTheme } from '../../../../themes/lightTheme';
import { JournalType } from '../../../../types/publicationFieldNames';
import { JournalArticleContentType } from '../../../../types/publication_types/content.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Journal, Registration } from '../../../../types/registration.types';
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

  return isNviApplicableJournalArticle ? (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.black}>
      {publicationInstance.type === JournalType.Article && (
        <NviValidationJournalArticle registration={registration as JournalRegistration} />
      )}
    </BackgroundDiv>
  ) : null;
};

interface NviValidationJournalArticleProps {
  registration: JournalRegistration;
}

const NviValidationJournalArticle = ({ registration }: NviValidationJournalArticleProps) => {
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
