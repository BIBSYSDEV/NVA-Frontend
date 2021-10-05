import { Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackgroundDiv } from '../../../../components/BackgroundDiv';
import { lightTheme } from '../../../../themes/lightTheme';
import { JournalType } from '../../../../types/publicationFieldNames';
import { JournalArticleContentType } from '../../../../types/publication_types/content.types';
import { JournalPublicationInstance } from '../../../../types/publication_types/journalRegistration.types';
import { Journal, Publisher, Registration } from '../../../../types/registration.types';

interface NviValidationProps {
  registration: Registration;
  journal?: Journal;
  publisher?: Publisher;
  series?: Journal;
}

export const NviValidation = ({ registration, journal, publisher, series }: NviValidationProps) => {
  const { type } = registration.entityDescription.reference.publicationInstance;

  const isNviApplicableType = type === JournalType.Article;

  return isNviApplicableType ? (
    <BackgroundDiv backgroundColor={lightTheme.palette.section.black}>
      {type === JournalType.Article && <NviValidationJournalArticle registration={registration} journal={journal} />}
    </BackgroundDiv>
  ) : null;
};

const NviValidationJournalArticle = ({
  registration,
  journal,
}: Pick<NviValidationProps, 'registration' | 'journal'>) => {
  const { t } = useTranslation('registration');
  const publicationInstance = registration.entityDescription.reference
    .publicationInstance as JournalPublicationInstance;

  if (
    publicationInstance.contentType !== JournalArticleContentType.ResearchArticle &&
    publicationInstance.contentType !== JournalArticleContentType.ReviewArticle
  ) {
    return null;
  }

  const isRated = parseInt(journal?.level ?? '0') > 0;
  const isPeerReviewed = !!publicationInstance.peerReviewed;

  return (
    <Typography>
      {isRated
        ? isPeerReviewed
          ? t('resource_type.nvi.applicable')
          : t('resource_type.nvi.not_peer_reviewed')
        : t('resource_type.nvi.channel_not_rated')}
    </Typography>
  );
};
