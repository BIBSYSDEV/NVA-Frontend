import InfoIcon from '@mui/icons-material/Info';
import { Paper, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchProtectedResource, fetchResource } from '../../../../api/commonApi';
import { BookType, ChapterType, JournalType } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Journal, Publisher, Registration, ScientificValue, Series } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface NviValidationProps {
  registration: Registration;
}

export const NviValidation = ({ registration }: NviValidationProps) => {
  if (!registration.entityDescription) {
    return null;
  }
  const { reference } = registration.entityDescription;
  const instanceType = reference?.publicationInstance.type;

  const isNviApplicableJournalArticle =
    instanceType === JournalType.AcademicArticle || instanceType === JournalType.AcademicLiteratureReview;
  const isNviApplicableBookMonograph = instanceType === BookType.AcademicMonograph;
  const isNviApplicableChapterArticle = instanceType === ChapterType.AcademicChapter;

  if (isNviApplicableJournalArticle) {
    const journalRegistration = registration as JournalRegistration;
    const journalId = journalRegistration.entityDescription.reference?.publicationContext.id;
    if (journalId) {
      return <NviValidationJournalArticle journalId={journalId} />;
    }
  } else if (isNviApplicableBookMonograph) {
    const bookRegistration = registration as BookRegistration;
    const publisherId = bookRegistration.entityDescription.reference?.publicationContext.publisher?.id;
    const seriesId = bookRegistration.entityDescription.reference?.publicationContext.series?.id;
    if (publisherId || seriesId) {
      return <NviValidationBookMonograph publisherId={publisherId ?? ''} seriesId={seriesId ?? ''} />;
    }
  } else if (isNviApplicableChapterArticle) {
    const chapterRegistration = registration as ChapterRegistration;
    const containerId = chapterRegistration.entityDescription.reference?.publicationContext.id;
    if (containerId) {
      return <NviValidationChapterArticle containerId={containerId} />;
    }
  }
  return null;
};

const NviValidationJournalArticle = ({ journalId }: { journalId: string }) => {
  const { t } = useTranslation();

  const journalQuery = useQuery({
    queryKey: ['channel', journalId],
    enabled: !!journalId,
    queryFn: () => fetchResource<Journal>(journalId),
    meta: { errorMessage: t('feedback.error.get_journal') },
    staleTime: Infinity,
  });

  const journalScientificValue = journalQuery.data?.scientificValue;

  return <NviStatus scientificValue={journalScientificValue} />;
};

const NviValidationBookMonograph = ({ publisherId, seriesId }: { publisherId: string; seriesId: string }) => {
  const { t } = useTranslation();

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
    queryFn: () => fetchResource<Series>(seriesId),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

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

const NviValidationChapterArticle = ({ containerId }: { containerId: string }) => {
  const { t } = useTranslation();

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
    queryFn: () => fetchResource<Series>(seriesId),
    meta: { errorMessage: t('feedback.error.get_series') },
    staleTime: Infinity,
  });

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
    <Paper elevation={5} sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', p: '1rem' }}>
      <InfoIcon color="primary" fontSize="large" />
      <Typography
        data-testid={
          isRated
            ? dataTestId.registrationWizard.resourceType.nviSuccess
            : dataTestId.registrationWizard.resourceType.nviFailed
        }>
        {isRated
          ? t('registration.resource_type.nvi.applicable')
          : t('registration.resource_type.nvi.channel_not_rated')}
      </Typography>
    </Paper>
  );
};
