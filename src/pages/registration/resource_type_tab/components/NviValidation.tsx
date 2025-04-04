import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchProtectedResource, fetchResource } from '../../../../api/commonApi';
import { InfoBanner } from '../../../../components/InfoBanner';
import { BookType, ChapterType, JournalType } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Publisher, Registration, ScientificValue, SerialPublication } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface NviValidationProps {
  registration: Registration;
}

export const NviValidation = ({ registration }: NviValidationProps) => {
  if (!registration.entityDescription) {
    return null;
  }
  const { reference } = registration.entityDescription;
  const instanceType = reference?.publicationInstance?.type;

  const isNviApplicableJournalArticle =
    instanceType === JournalType.AcademicArticle || instanceType === JournalType.AcademicLiteratureReview;
  const isNviApplicableBookMonograph = instanceType === BookType.AcademicMonograph;
  const isNviApplicableChapterArticle = instanceType === ChapterType.AcademicChapter;

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
  const { t } = useTranslation();
  const journalId = registration.entityDescription.reference?.publicationContext.id ?? '';

  const journalQuery = useQuery({
    queryKey: ['channel', journalId],
    enabled: !!journalId,
    queryFn: () => fetchResource<SerialPublication>(journalId),
    meta: { errorMessage: t('feedback.error.get_journal') },
    staleTime: Infinity,
  });

  if (!journalId) {
    return null;
  }

  const journalScientificValue = journalQuery.data?.scientificValue;

  return <NviStatus scientificValue={journalScientificValue} />;
};

const NviValidationBookMonograph = ({ registration }: { registration: BookRegistration }) => {
  const { t } = useTranslation();
  const publisherId = registration.entityDescription.reference?.publicationContext.publisher?.id ?? '';
  const seriesId = registration.entityDescription.reference?.publicationContext.series?.id ?? '';

  const publisherQuery = useQuery({
    queryKey: ['channel', publisherId],
    enabled: !!publisherId,
    queryFn: () => fetchResource<Publisher>(publisherId),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });

  const seriesQuery = useQuery({
    queryKey: ['channel', seriesId],
    enabled: !!seriesId,
    queryFn: () => fetchResource<SerialPublication>(seriesId),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

  if (!publisherId && !seriesId) {
    return null;
  }

  const publisherScientificValue = publisherQuery.data?.scientificValue;
  const seriesScientificValue = seriesQuery.data?.scientificValue;

  return (
    <NviStatus
      scientificValue={
        seriesScientificValue && seriesScientificValue !== 'Unassigned'
          ? seriesScientificValue
          : publisherScientificValue
      }
    />
  );
};

const NviValidationChapterArticle = ({ registration }: { registration: ChapterRegistration }) => {
  const { t } = useTranslation();
  const containerId = registration.entityDescription.reference?.publicationContext.id ?? '';

  const containerQuery = useQuery({
    queryKey: ['registration', containerId],
    enabled: !!containerId,
    queryFn: () => fetchProtectedResource<BookRegistration>(containerId),
    meta: { errorMessage: t('feedback.error.get_registration') },
  });

  const publisherId = containerQuery.data?.entityDescription.reference?.publicationContext.publisher?.id ?? '';
  const seriesId = containerQuery.data?.entityDescription.reference?.publicationContext.series?.id ?? '';

  const publisherQuery = useQuery({
    queryKey: ['channel', publisherId],
    enabled: !!publisherId,
    queryFn: () => fetchResource<Publisher>(publisherId),
    meta: { errorMessage: t('feedback.error.get_publisher') },
    staleTime: Infinity,
  });

  const seriesQuery = useQuery({
    queryKey: ['channel', seriesId],
    enabled: !!seriesId,
    queryFn: () => fetchResource<SerialPublication>(seriesId),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

  if (!containerId) {
    return null;
  }

  const publisherScientificValue = publisherQuery.data?.scientificValue;
  const seriesScientificValue = seriesQuery.data?.scientificValue;

  return (
    <NviStatus
      scientificValue={
        seriesScientificValue && seriesScientificValue !== 'Unassigned'
          ? seriesScientificValue
          : publisherScientificValue
      }
    />
  );
};

interface NviStatusProps {
  scientificValue?: ScientificValue;
}

const NviStatus = ({ scientificValue }: NviStatusProps) => {
  const { t } = useTranslation();

  const isRated = scientificValue === 'LevelOne' || scientificValue === 'LevelTwo';

  return (
    <InfoBanner
      text={
        isRated ? t('registration.resource_type.nvi.applicable') : t('registration.resource_type.nvi.channel_not_rated')
      }
      data-testid={
        isRated
          ? dataTestId.registrationWizard.resourceType.nviSuccess
          : dataTestId.registrationWizard.resourceType.nviFailed
      }
    />
  );
};
