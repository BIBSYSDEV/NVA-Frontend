import * as Yup from 'yup';
import { parse as parseIsbn } from 'isbn-utils';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  ReportType,
  ResearchDataType,
} from '../../../types/publicationFieldNames';
import i18n from '../../../translations/i18n';
import { ArtisticPublicationInstance, DesignType } from '../../../types/publication_types/artisticRegistration.types';
import { YupShape } from '../validationHelpers';
import {
  JournalPublicationInstance,
  JournalPublicationContext,
} from '../../../types/publication_types/journalRegistration.types';
import {
  BookPublicationInstance,
  BookPublicationContext,
} from '../../../types/publication_types/bookRegistration.types';
import {
  ReportPublicationContext,
  ReportPublicationInstance,
} from '../../../types/publication_types/reportRegistration.types';
import {
  DegreePublicationInstance,
  DegreePublicationContext,
} from '../../../types/publication_types/degreeRegistration.types';
import {
  ChapterPublicationInstance,
  ChapterPublicationContext,
} from '../../../types/publication_types/chapterRegistration.types';
import {
  PresentationPublicationContext,
  PresentationPublicationInstance,
} from '../../../types/publication_types/presentationRegistration.types';
import {
  MediaContributionPeriodicalPublicationContext,
  MediaContributionPeriodicalPublicationInstance,
  MediaContributionPublicationContext,
  MediaContributionPublicationInstance,
} from '../../../types/publication_types/mediaContributionRegistration.types';
import {
  ResearchDataPublicationContext,
  ResearchDataPublicationInstance,
} from '../../../types/publication_types/researchDataRegistration.types';
import { isPeriodicalMediaContribution } from '../../registration-helpers';
import {
  MapPublicationContext,
  MapPublicationInstance,
} from '../../../types/publication_types/otherRegistration.types';
import { ContextPublisher, PublicationChannelType } from '../../../types/registration.types';

const resourceErrorMessage = {
  announcementsRequired: i18n.t('translation:feedback.validation.announcement_required'),
  corrigendumForRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.original_article'),
  }),
  corrigendumForInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.resource_type.original_article'),
  }),
  countryRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.country'),
  }),
  dateToBeforeDateFrom: i18n.t('translation:feedback.validation.cannot_be_before', {
    field: i18n.t('translation:common.end_date'),
    limitField: i18n.t('translation:common.start_date'),
  }),
  dateFromInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.resource_type.date_from'),
  }),
  dateFromRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.date_from'),
  }),
  dateToInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.resource_type.date_to'),
  }),
  dateToRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.date_to'),
  }),
  doiInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.registration.link_to_resource'),
  }),
  eventTitleRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.title_of_event'),
  }),
  exhibitionRequired: i18n.t('translation:feedback.validation.exhibition_place_required'),
  fromMustBeBeforeTo: i18n.t('translation:feedback.validation.cannot_be_after', {
    field: i18n.t('translation:registration.resource_type.date_from'),
    limitField: i18n.t('translation:registration.resource_type.date_to').toLowerCase(),
  }),
  isbnInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.resource_type.isbn'),
  }),
  isbnTooShort: i18n.t('translation:feedback.validation.isbn_too_short'),
  journalNotSelected: i18n.t('translation:feedback.validation.not_selected', {
    field: i18n.t('translation:registration.resource_type.journal'),
  }),
  journalRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.journal'),
  }),
  organizerRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.organizer'),
  }),
  pageBeginMustBeSmallerThanEnd: i18n.t('translation:feedback.validation.must_be_smaller_than', {
    field: i18n.t('translation:registration.resource_type.pages_from'),
    limit: i18n.t('translation:registration.resource_type.pages_to'),
  }),
  pageEndMustBeBiggerThanBegin: i18n.t('translation:feedback.validation.must_be_bigger_than', {
    field: i18n.t('translation:registration.resource_type.pages_to'),
    limit: i18n.t('translation:registration.resource_type.pages_from'),
  }),
  pagesInvalid: i18n.t('translation:feedback.validation.has_invalid_format', {
    field: i18n.t('translation:registration.resource_type.number_of_pages'),
  }),
  pagesMustBeBigger: i18n.t('translation:feedback.validation.must_be_bigger_than', {
    field: i18n.t('translation:registration.resource_type.number_of_pages'),
    limit: 1,
  }),
  partOfRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.chapter.published_in'),
  }),
  placeRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.place_for_event'),
  }),
  publisherNotSelected: i18n.t('translation:feedback.validation.not_selected', {
    field: i18n.t('translation:common.publisher'),
  }),
  publisherRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:common.publisher'),
  }),
  seriesNotSelected: i18n.t('translation:feedback.validation.not_selected', {
    field: i18n.t('translation:registration.resource_type.series'),
  }),
  toMustBeAfterFrom: i18n.t('translation:feedback.validation.cannot_be_before', {
    field: i18n.t('translation:registration.resource_type.date_to'),
    limitField: i18n.t('translation:registration.resource_type.date_from').toLowerCase(),
  }),
  typeRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.resource_type'),
  }),
  typeWorkRequired: i18n.t('translation:feedback.validation.is_required', {
    field: i18n.t('translation:registration.resource_type.type_work'),
  }),
};

export const emptyStringToNull = (value: string, originalValue: string) => (originalValue === '' ? null : value);

// Common Fields
export const isbnField = Yup.string()
  .min(13, resourceErrorMessage.isbnTooShort)
  .test('isbn-test', resourceErrorMessage.isbnInvalid, (isbn) => !isbn || !!parseIsbn(isbn ?? '')?.isIsbn13());

const isbnListField = Yup.array().of(isbnField);

const pagesMonographField = Yup.object()
  .nullable()
  .shape({
    pages: Yup.number()
      .typeError(resourceErrorMessage.pagesInvalid)
      .min(1, resourceErrorMessage.pagesMustBeBigger)
      .transform(emptyStringToNull)
      .nullable(),
  });

const pagesRangeField = Yup.object()
  .nullable()
  .shape({
    begin: Yup.string()
      .nullable()
      .test('begin-test', resourceErrorMessage.pageBeginMustBeSmallerThanEnd, (beginValue, context) => {
        const beginNumber = parseInt(beginValue ?? '');
        const endNumber = parseInt(context.parent.end);
        if (!isNaN(beginNumber) && !isNaN(endNumber)) {
          return beginNumber <= endNumber;
        }
        return true;
      }),
    end: Yup.string()
      .nullable()
      .test('end-test', resourceErrorMessage.pageEndMustBeBiggerThanBegin, (endValue, context) => {
        const beginNumber = parseInt(context.parent.begin);
        const endNumber = parseInt(endValue ?? '');
        if (!isNaN(beginNumber) && !isNaN(endNumber)) {
          return beginNumber <= endNumber;
        }
        return true;
      }),
  });

export const periodField = Yup.object().shape({
  from: Yup.date().required(resourceErrorMessage.dateFromRequired).typeError(resourceErrorMessage.dateFromInvalid),
  to: Yup.date()
    .required(resourceErrorMessage.dateToRequired)
    .typeError(resourceErrorMessage.dateToInvalid)
    .when('from', (from, schema) =>
      from instanceof Date && !isNaN(from.getTime())
        ? schema.min(from, resourceErrorMessage.dateToBeforeDateFrom)
        : schema
    ),
});

const publisherField: Yup.ObjectSchema<ContextPublisher> = Yup.object({
  type: Yup.string<PublicationChannelType.UnconfirmedPublisher | PublicationChannelType.Publisher>().defined(),
  name: Yup.string().optional(),
  id: Yup.string().when('name', ([name], schema) =>
    name
      ? schema.required(resourceErrorMessage.publisherNotSelected)
      : schema.required(resourceErrorMessage.publisherRequired)
  ),
});

const seriesField = Yup.object().shape({
  id: Yup.string().test(
    'series-test',
    resourceErrorMessage.seriesNotSelected,
    (idValue, context) => !context.parent.title || !!idValue
  ),
});

export const baseReference = Yup.object()
  .shape({
    doi: Yup.string().nullable().trim().url(resourceErrorMessage.doiInvalid),
    publicationInstance: Yup.object().shape({
      type: Yup.string().required(resourceErrorMessage.typeRequired),
    }),
  })
  .nullable()
  .required(resourceErrorMessage.typeRequired);

// Journal
const journalPublicationInstance = Yup.object<YupShape<JournalPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(JournalType)).required(resourceErrorMessage.typeRequired),
  articleNumber: Yup.string().nullable(),
  volume: Yup.string().nullable(),
  issue: Yup.string().nullable(),
  pages: pagesRangeField,
  corrigendumFor: Yup.string()
    .nullable()
    .when('type', ([type], schema) =>
      type === JournalType.Corrigendum
        ? schema.url(resourceErrorMessage.corrigendumForInvalid).required(resourceErrorMessage.corrigendumForRequired)
        : schema
    ),
});

const journalPublicationContext = Yup.object<YupShape<JournalPublicationContext>>({
  id: Yup.string().when('$publicationInstanceType', ([publicationInstanceType], schema) =>
    publicationInstanceType === JournalType.Corrigendum
      ? schema
      : schema.when('title', ([title], subSchema) =>
          !!title
            ? subSchema.required(resourceErrorMessage.journalNotSelected)
            : subSchema.required(resourceErrorMessage.journalRequired)
        )
  ),
});

export const journalReference = baseReference.shape({
  publicationInstance: journalPublicationInstance,
  publicationContext: journalPublicationContext,
});

// Book
const bookPublicationInstance = Yup.object<YupShape<BookPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(BookType)).required(resourceErrorMessage.typeRequired),
  pages: pagesMonographField,
});

const bookPublicationContext = Yup.object<YupShape<BookPublicationContext>>({
  publisher: publisherField,
  series: seriesField,
  isbnList: isbnListField,
});

export const bookReference = baseReference.shape({
  publicationInstance: bookPublicationInstance,
  publicationContext: bookPublicationContext,
});

// Report
const reportPublicationInstance = Yup.object<YupShape<ReportPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(ReportType)).required(resourceErrorMessage.typeRequired),
  pages: pagesMonographField,
});

const reportPublicationContext = Yup.object<YupShape<ReportPublicationContext>>({
  publisher: publisherField,
  series: seriesField,
  isbnList: isbnListField,
});

export const reportReference = baseReference.shape({
  publicationInstance: reportPublicationInstance,
  publicationContext: reportPublicationContext,
});

// Degree
const degreePublicationInstance = Yup.object<YupShape<DegreePublicationInstance>>({
  type: Yup.string().oneOf(Object.values(DegreeType)).required(resourceErrorMessage.typeRequired),
});

const degreePublicationContext = Yup.object<YupShape<DegreePublicationContext>>({
  publisher: publisherField,
  series: seriesField,
});

export const degreeReference = baseReference.shape({
  publicationInstance: degreePublicationInstance,
  publicationContext: degreePublicationContext,
});

// Chapter
const chapterPublicationInstance = Yup.object<YupShape<ChapterPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(ChapterType)).required(resourceErrorMessage.typeRequired),
  pages: pagesRangeField,
});

const chapterPublicationContext = Yup.object<YupShape<ChapterPublicationContext>>({
  partOf: Yup.string().nullable().required(resourceErrorMessage.partOfRequired),
});

export const chapterReference = baseReference.shape({
  publicationInstance: chapterPublicationInstance,
  publicationContext: chapterPublicationContext,
});

// Event/Presentation
const presentationPublicationInstance = Yup.object<YupShape<PresentationPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(PresentationType)).required(resourceErrorMessage.typeRequired),
});

const presentationPublicationContext = Yup.object<YupShape<PresentationPublicationContext>>({
  label: Yup.string().nullable().required(resourceErrorMessage.eventTitleRequired),
  place: Yup.object().shape({
    label: Yup.string().nullable().required(resourceErrorMessage.placeRequired),
    country: Yup.string().nullable().required(resourceErrorMessage.countryRequired),
  }),
  agent: Yup.object().shape({
    name: Yup.string().nullable().required(resourceErrorMessage.organizerRequired),
  }),
  time: periodField,
});

export const presentationReference = baseReference.shape({
  publicationInstance: presentationPublicationInstance,
  publicationContext: presentationPublicationContext,
});

// Artistic
const artisticDesignPublicationInstance = Yup.object<YupShape<ArtisticPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(ArtisticType)).required(resourceErrorMessage.typeRequired),
  subtype: Yup.object().shape({
    type: Yup.string()
      .nullable()
      .when('$publicationInstanceType', ([publicationInstanceType], schema) =>
        publicationInstanceType === ArtisticType.MusicPerformance
          ? schema.optional()
          : schema.required(resourceErrorMessage.typeWorkRequired)
      ),
    description: Yup.string()
      .nullable()
      .when('type', ([type], schema) =>
        type === DesignType.Other ? schema.required(resourceErrorMessage.typeWorkRequired) : schema
      ),
  }),
  description: Yup.string().nullable(),
  venues: Yup.array().when('$publicationInstanceType', ([publicationInstanceType], schema) =>
    publicationInstanceType === ArtisticType.ArtisticDesign || publicationInstanceType === ArtisticType.VisualArts
      ? schema.min(1, resourceErrorMessage.exhibitionRequired).required(resourceErrorMessage.exhibitionRequired)
      : schema.nullable()
  ),
  architectureOutput: Yup.array().when('$publicationInstanceType', ([publicationInstanceType], schema) =>
    publicationInstanceType === ArtisticType.ArtisticArchitecture
      ? schema.min(1, resourceErrorMessage.announcementsRequired).required(resourceErrorMessage.announcementsRequired)
      : schema.nullable()
  ),
  outputs: Yup.array().when('$publicationInstanceType', ([type], schema) => {
    if (type === ArtisticType.PerformingArts) {
      return schema.min(1, resourceErrorMessage.exhibitionRequired).required(resourceErrorMessage.exhibitionRequired);
    } else if (type === ArtisticType.MovingPicture) {
      return schema
        .min(1, resourceErrorMessage.announcementsRequired)
        .required(resourceErrorMessage.announcementsRequired);
    } else {
      return schema.nullable();
    }
  }),
  manifestations: Yup.array().when('$publicationInstanceType', ([publicationInstanceType], schema) =>
    publicationInstanceType === ArtisticType.MusicPerformance || publicationInstanceType === ArtisticType.LiteraryArts
      ? schema.min(1, resourceErrorMessage.announcementsRequired).required(resourceErrorMessage.announcementsRequired)
      : schema.nullable()
  ),
});

export const artisticDesignReference = baseReference.shape({
  publicationInstance: artisticDesignPublicationInstance,
});

// Media Contribution
const mediaContributionPublicationContext = Yup.object().when(
  '$publicationInstanceType',
  ([publicationInstanceType]) => {
    if (isPeriodicalMediaContribution(publicationInstanceType)) {
      return Yup.object<YupShape<MediaContributionPeriodicalPublicationContext>>({
        id: Yup.string().required(resourceErrorMessage.journalRequired),
      });
    } else {
      return Yup.object<YupShape<MediaContributionPublicationContext>>({
        format: Yup.string()
          .nullable()
          .required(
            i18n.t('translation:feedback.validation.is_required', {
              field: i18n.t('translation:registration.resource_type.media_contribution.format'),
            })
          ),
        medium: Yup.object().shape({
          type: Yup.string()
            .nullable()
            .required(
              i18n.t('translation:feedback.validation.is_required', {
                field: i18n.t('translation:registration.resource_type.media_contribution.medium'),
              })
            ),
        }),
        disseminationChannel: Yup.string()
          .nullable()
          .required(
            i18n.t('translation:feedback.validation.is_required', {
              field: i18n.t('translation:registration.resource_type.media_contribution.channel'),
            })
          ),
      });
    }
  }
);

const mediaContributionPublicationInstance = Yup.object().when(
  '$publicationInstanceType',
  ([publicationInstanceType]) => {
    if (isPeriodicalMediaContribution(publicationInstanceType)) {
      return Yup.object<YupShape<MediaContributionPeriodicalPublicationInstance>>({
        type: Yup.string().oneOf(Object.values(MediaType)).required(resourceErrorMessage.typeRequired),
        articleNumber: Yup.string().nullable(),
        volume: Yup.string().nullable(),
        issue: Yup.string().nullable(),
        pages: pagesRangeField,
      });
    } else {
      return Yup.object<YupShape<MediaContributionPublicationInstance>>({
        type: Yup.string().oneOf(Object.values(MediaType)).required(resourceErrorMessage.typeRequired),
      });
    }
  }
);

export const mediaContributionReference = baseReference.shape({
  publicationContext: mediaContributionPublicationContext,
  publicationInstance: mediaContributionPublicationInstance,
});

// Research Data
const researchDataPublicationContext = Yup.object<YupShape<ResearchDataPublicationContext>>({
  publisher: Yup.object()
    .nullable()
    .when('$publicationInstanceType', ([publicationInstanceType], schema) =>
      publicationInstanceType === ResearchDataType.DataManagementPlan ? publisherField : schema
    ),
});

const researchDataPublicationInstance = Yup.object<YupShape<ResearchDataPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(ResearchDataType)).required(resourceErrorMessage.typeRequired),
  userAgreesToTermsAndConditions: Yup.boolean()
    .nullable()
    .when('$publicationInstanceType', ([publicationInstanceType], schema) =>
      publicationInstanceType === ResearchDataType.Dataset
        ? Yup.boolean().equals([true], i18n.t('translation:feedback.validation.must_accept_terms_for_dataset'))
        : schema
    ),
  related: Yup.array(),
});

export const researchDataReference = baseReference.shape({
  publicationContext: researchDataPublicationContext,
  publicationInstance: researchDataPublicationInstance,
});

// Map
const mapPublicationContext = Yup.object<YupShape<MapPublicationContext>>({
  publisher: publisherField,
});

const mapPublicationInstance = Yup.object<YupShape<MapPublicationInstance>>({
  type: Yup.string().oneOf(Object.values(OtherRegistrationType)).required(resourceErrorMessage.typeRequired),
});

export const mapReference = baseReference.shape({
  publicationContext: mapPublicationContext,
  publicationInstance: mapPublicationInstance,
});
