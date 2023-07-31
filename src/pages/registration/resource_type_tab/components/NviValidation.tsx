import { Paper, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { BookType, ChapterType, JournalType } from '../../../../types/publicationFieldNames';
import { BookRegistration } from '../../../../types/publication_types/bookRegistration.types';
import { ChapterRegistration } from '../../../../types/publication_types/chapterRegistration.types';
import { JournalRegistration } from '../../../../types/publication_types/journalRegistration.types';
import { Journal, Publisher, Registration, ScientificValue, Series } from '../../../../types/registration.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useFetchResource } from '../../../../utils/hooks/useFetchResource';

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

  const resourceState = useSelector((store: RootState) => store.resources);
  const journal = reference?.publicationContext.id ? (resourceState[reference.publicationContext.id] as Journal) : null;

  return <NviStatus scientificValue={journal?.scientificValue} />;
};

const NviValidationBookMonograph = ({ registration }: { registration: BookRegistration }) => {
  const { reference } = registration.entityDescription;

  const resourceState = useSelector((store: RootState) => store.resources);
  const publisher = reference?.publicationContext.publisher?.id
    ? (resourceState[reference.publicationContext.publisher.id] as Publisher)
    : null;
  const series = reference?.publicationContext.series?.id
    ? (resourceState[reference.publicationContext.series.id] as Series)
    : null;

  return (
    <NviStatus
      scientificValue={
        series?.scientificValue && series.scientificValue !== 'Unassigned'
          ? series.scientificValue
          : publisher?.scientificValue
      }
    />
  );
};

const NviValidationChapterArticle = ({ registration }: { registration: ChapterRegistration }) => {
  const { t } = useTranslation();
  const resourceState = useSelector((store: RootState) => store.resources);

  const { reference } = registration.entityDescription;

  const container = reference?.publicationContext.id
    ? (resourceState[reference.publicationContext.id] as BookRegistration)
    : null;
  const containerPublicationContext = container?.entityDescription.reference?.publicationContext;

  const [publisher] = useFetchResource<Publisher>(
    containerPublicationContext?.publisher?.id ?? '',
    t('feedback.error.get_publisher')
  );
  const [series] = useFetchResource<Series>(
    containerPublicationContext?.series?.id ?? '',
    t('feedback.error.get_series')
  );

  return (
    <NviStatus
      scientificValue={
        series?.scientificValue && series.scientificValue !== 'Unassigned'
          ? series.scientificValue
          : publisher?.scientificValue
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
