import { Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootStore } from '../../../../redux/reducers/rootReducer';
import { BookType, ChapterType, JournalType } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import {
  BookMonographContentType,
  ChapterContentType,
  JournalArticleContentType,
} from '../../../../types/publication_types/content.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Journal, Publisher, Registration } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';
import { Card } from '../../../../components/Card';

interface NviValidationProps {
  registration: Registration;
}

export const NviValidation = ({ registration }: NviValidationProps) => {
  if (!registration.entityDescription) {
    return null;
  }
  const { reference } = registration.entityDescription;
  const instanceType = reference?.publicationInstance.type;
  const contentType =
    reference && 'contentType' in reference.publicationInstance ? reference.publicationInstance.contentType : '';

  const isNviApplicableJournalArticle =
    instanceType === JournalType.Article &&
    (contentType === JournalArticleContentType.ResearchArticle ||
      contentType === JournalArticleContentType.ReviewArticle);

  const isNviApplicableBookMonograph =
    instanceType === BookType.Monograph && contentType === BookMonographContentType.AcademicMonograph;

  const isNviApplicableChapterArticle =
    instanceType === ChapterType.AnthologyChapter && contentType === ChapterContentType.AcademicChapter;

  return isNviApplicableJournalArticle || isNviApplicableBookMonograph || isNviApplicableChapterArticle ? (
    <>
      {isNviApplicableJournalArticle ? (
        <NviValidationJournalArticle registration={registration as JournalRegistration} />
      ) : isNviApplicableBookMonograph ? (
        <NviValidationBookMonograph registration={registration as BookRegistration} />
      ) : isNviApplicableChapterArticle ? (
        <NviValidationChapterArticle registration={registration as ChapterRegistration} />
      ) : null}
    </>
  ) : null;
};

const NviValidationJournalArticle = ({ registration }: { registration: JournalRegistration }) => {
  const { reference } = registration.entityDescription;

  const resourceState = useSelector((store: RootStore) => store.resources);
  const journal = reference?.publicationContext.id ? (resourceState[reference.publicationContext.id] as Journal) : null;

  return <NviStatus level={journal?.level} isPeerReviewed={!!reference?.publicationInstance.peerReviewed} />;
};

const NviValidationBookMonograph = ({ registration }: { registration: BookRegistration }) => {
  const { reference } = registration.entityDescription;

  const resourceState = useSelector((store: RootStore) => store.resources);
  const publisher = reference?.publicationContext.publisher?.id
    ? (resourceState[reference.publicationContext.publisher.id] as Publisher)
    : null;
  const series = reference?.publicationContext.series?.id
    ? (resourceState[reference.publicationContext.series.id] as Journal)
    : null;

  return (
    <NviStatus
      level={series?.level ?? publisher?.level}
      isPeerReviewed={!!reference?.publicationInstance.peerReviewed}
    />
  );
};

const NviValidationChapterArticle = ({ registration }: { registration: ChapterRegistration }) => {
  const { t } = useTranslation('feedback');
  const resourceState = useSelector((store: RootStore) => store.resources);

  const { reference } = registration.entityDescription;

  const container = reference?.publicationContext.partOf
    ? (resourceState[reference.publicationContext.partOf] as BookRegistration)
    : null;
  const containerPublicationContext = container?.entityDescription.reference?.publicationContext;

  const [publisher] = useFetchResource<Publisher>(
    containerPublicationContext?.publisher?.id ?? '',
    t('error.get_publisher')
  );
  const [series] = useFetchResource<Journal>(containerPublicationContext?.series?.id ?? '', t('error.get_series'));

  return (
    <NviStatus
      level={series?.level ?? publisher?.level}
      isPeerReviewed={!!reference?.publicationInstance.peerReviewed}
    />
  );
};

interface NviStatusProps {
  level?: string;
  isPeerReviewed?: boolean;
}

const NviStatus = ({ level = '', isPeerReviewed = false }: NviStatusProps) => {
  const { t } = useTranslation('registration');

  const isRated = parseInt(level) > 0;

  return (
    <Card sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <InfoIcon color="primary" fontSize="large" />
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
    </Card>
  );
};
