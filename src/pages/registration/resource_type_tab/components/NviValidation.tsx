import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchResource } from '../../../../api/commonApi';
import { InfoBanner } from '../../../../components/InfoBanner';
import { BookType, ChapterType, JournalType } from '../../../../types/publicationFieldNames';
import { BookRegistration, Revision } from '../../../../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Publisher, Registration, SerialPublication } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { NviValidationChapter } from './NviValidationChapter';
import { NviStatus } from './NviStatus';

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
  const isNviApplicableChapter = instanceType === ChapterType.AcademicChapter;

  return isNviApplicableJournalArticle || isNviApplicableBookMonograph || isNviApplicableChapter ? (
    <>
      {isNviApplicableJournalArticle ? (
        <NviValidationJournalArticle registration={registration as JournalRegistration} />
      ) : isNviApplicableBookMonograph ? (
        <NviValidationBookMonograph registration={registration as BookRegistration} />
      ) : isNviApplicableChapter ? (
        <NviValidationChapter registration={registration as ChapterRegistration} />
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
  const isRevision = registration.entityDescription.reference?.publicationContext.revision === Revision.Revised;

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

  return isRevision ? (
    <InfoBanner
      text={t('registration.resource_type.nvi.not_applicable_revision')}
      data-testid={dataTestId.registrationWizard.resourceType.nviFailed}
    />
  ) : (
    <NviStatus
      scientificValue={
        seriesScientificValue && seriesScientificValue !== 'Unassigned'
          ? seriesScientificValue
          : publisherScientificValue
      }
    />
  );
};
