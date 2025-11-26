import { PublicationChannelType, Registration } from '../../types/registration.types';
import { describe, expect, it } from 'vitest';
import { getFormattedRegistration } from '../registration-helpers';
import { mockRegistration } from '../testfiles/mockRegistration';
import {
  ArtisticType,
  BookType,
  ChapterType,
  DegreeType,
  ExhibitionContentType,
  JournalType,
  MediaType,
  OtherRegistrationType,
  PresentationType,
  PublicationType,
  ReportType,
  ResearchDataType,
} from '../../types/publicationFieldNames';
import { MediaMedium } from '../../types/publication_types/mediaContributionRegistration.types';
import { ExhibitionProductionSubtype } from '../../types/publication_types/exhibitionContent.types';

describe('getFormattedRegistration', () => {
  it('adds missing entityDescription.type and reference.type', () => {
    const registration = {
      entityDescription: {
        reference: {
          publicationInstance: { type: JournalType.AcademicArticle },
        },
      },
    } as Registration;
    const result = getFormattedRegistration(registration);
    expect(result.entityDescription.type).toBe('EntityDescription');
    expect(result.entityDescription.reference.type).toBe('Reference');
  });

  describe('when category has pages attribute', () => {
    describe.each(journalContextTypes)('category is %s', (journalContextType) => {
      describe.each(journalTypes)('publication instance type is %s', (journalType) => {
        it('returns registration unchanged if pages is missing', () => {
          const registration = createRegistration({ contextType: journalContextType, instanceType: journalType });
          const result = getFormattedRegistration(registration);
          expect(getPages(result)).toBeFalsy();
        });

        it('returns registration unchanged if pages.type is "Range"', () => {
          const registration = createRegistration({
            contextType: journalContextType,
            instanceType: journalType,
            pages: { type: 'Range', from: '1', to: '10' },
          });
          const result = getFormattedRegistration(registration);
          const pages = getPages(result);
          expect(pages).toBeDefined();
          expect((pages as any).type).toBe('Range');
          expect((pages as any).from).toBe('1');
          expect((pages as any).to).toBe('10');
        });

        it('updates pages.type to "Range" if type is missing', () => {
          const registration = createRegistration({
            contextType: journalContextType,
            instanceType: journalType,
            pages: { from: '1', to: '10' },
          });
          const result = getFormattedRegistration(registration);
          const pages = getPages(result);
          expect(pages).toBeDefined();
          expect((pages as any).type).toBe('Range');
        });

        it('updates pages.type to "Range" if type is not "Range"', () => {
          const registration = createRegistration({
            contextType: journalContextType,
            instanceType: journalType,
            pages: { type: 'Other', from: '1', to: '10' },
          });
          const result = getFormattedRegistration(registration);
          const pages = getPages(result);
          expect(pages).toBeDefined();
          expect((pages as any).type).toBe('Range');
        });
      });
    });

    describe('category is of Anthology-type', () => {
      describe.each(chapterTypes)('publication instance is %s', (chapterType) => {
        it('returns registration unchanged if pages is missing', () => {
          const registration = createRegistration({
            contextType: PublicationType.Anthology,
            instanceType: chapterType,
          });
          const result = getFormattedRegistration(registration);
          expect(getPages(result)).toBeFalsy();
        });

        it('returns registration unchanged if pages.type is "Range"', () => {
          const registration = createRegistration({
            contextType: PublicationType.Anthology,
            instanceType: chapterType,
            pages: { type: 'Range', from: '1', to: '10' },
          });
          const result = getFormattedRegistration(registration);
          const pages = getPages(result);
          expect(pages).toBeDefined();
          expect((pages as any).type).toBe('Range');
        });

        it('updates pages.type to "Range" if type is missing', () => {
          const registration = createRegistration({
            contextType: PublicationType.Anthology,
            instanceType: chapterType,
            pages: { from: '1', to: '10' },
          });
          const result = getFormattedRegistration(registration);
          const pages = getPages(result);
          expect(pages).toBeDefined();
          expect((pages as any).type).toBe('Range');
        });

        it('updates pages.type to "Range" if type is not "Range"', () => {
          const registration = createRegistration({
            contextType: PublicationType.Anthology,
            instanceType: chapterType,
            pages: { type: 'Other', from: '1', to: '10' },
          });
          const result = getFormattedRegistration(registration);
          const pages = getPages(result);
          expect(pages).toBeDefined();
          expect((pages as any).type).toBe('Range');
        });
      });
    });

    describe.each(mediaContributionPeriodicalTypes)(
      'category is of type Media Contribution Periodical (%s)',
      (publicationContext) => {
        describe.each(mediaFeatureTypes)('publication instance is %s', (mediaType) => {
          it('returns registration unchanged if pages is missing', () => {
            const registration = createRegistration({
              contextType: publicationContext,
              instanceType: mediaType,
            });
            const result = getFormattedRegistration(registration);
            expect(getPages(result)).toBeFalsy();
          });

          it('returns registration unchanged if pages.type is "Range"', () => {
            const registration = createRegistration({
              contextType: publicationContext,
              instanceType: mediaType,
              pages: { type: 'Range', from: '1', to: '10' },
            });
            const result = getFormattedRegistration(registration);
            const pages = getPages(result);
            expect(pages).toBeDefined();
            expect((pages as any).type).toBe('Range');
          });

          it('updates pages.type to "Range" if type is missing', () => {
            const registration = createRegistration({
              contextType: publicationContext,
              instanceType: mediaType,
              pages: { from: '1', to: '10' },
            });
            const result = getFormattedRegistration(registration);
            const pages = getPages(result);
            expect(pages).toBeDefined();
            expect((pages as any).type).toBe('Range');
          });

          it('updates pages.type to "Range" if type is not "Range"', () => {
            const registration = createRegistration({
              contextType: publicationContext,
              instanceType: mediaType,
              pages: { type: 'Other', from: '1', to: '10' },
            });
            const result = getFormattedRegistration(registration);
            const pages = getPages(result);
            expect(pages).toBeDefined();
            expect((pages as any).type).toBe('Range');
          });
        });
      }
    );
  });

  it('does not update pages.type to "Range" in any Degree', () => {
    publicationTypes.forEach((publicationChannel) => {
      degreeTypes.forEach((degreeType) => {
        const registration = createRegistration({
          contextType: publicationChannel,
          instanceType: degreeType,
          pages: { type: 'MonographPages', pages: '10' },
        });
        const result = getFormattedRegistration(registration);
        const pages = getPages(result);
        expect(pages).toBeDefined();
        expect((pages as any).type).toBe('MonographPages');
      });
    });
  });

  it('does not update pages.type to "Range" in any Book', () => {
    publicationTypes.forEach((publicationType) => {
      bookTypes.forEach((bookType) => {
        const registration = createRegistration({
          contextType: publicationType,
          instanceType: bookType,
          pages: { type: 'MonographPages', pages: '10' },
        });
        const result = getFormattedRegistration(registration);
        const pages = getPages(result);
        expect(pages).toBeDefined();
        expect((pages as any).type).toBe('MonographPages');
      });
    });
  });

  it('does not update pages.type to "Range" in any Report', () => {
    publicationTypes.forEach((publicationType) => {
      reportTypes.forEach((reportType) => {
        const registration = createRegistration({
          contextType: publicationType,
          instanceType: reportType,
          pages: { type: 'MonographPages', pages: '10' },
        });
        const result = getFormattedRegistration(registration);
        const pages = getPages(result);
        expect(pages).toBeDefined();
        expect((pages as any).type).toBe('MonographPages');
      });
    });
  });

  it('does not update pages.type to "Range" in any Presentation', () => {
    presentationTypes.forEach((presentationType) => {
      const registration = createRegistration({
        contextType: PublicationType.Presentation,
        instanceType: presentationType,
      });
      const result = getFormattedRegistration(registration);
      expect(getPages(result)).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" in any Artistic reference', () => {
    artisticTypes.forEach((artisticType) => {
      const registration = createRegistration({
        contextType: PublicationType.Artistic,
        extra: { publicationInstance: { type: artisticType, description: 'aaa' } },
      });
      const result = getFormattedRegistration(registration);
      expect(getPages(result)).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" if missing from any Media Contribution Reference', () => {
    publicationTypes.forEach((publicationType) => {
      mediaMediums.forEach((mediaMedium) => {
        mediaTypes.forEach((mediaType) => {
          const registration = createRegistration({
            contextType: publicationType,
            instanceType: mediaType,
            extra: {
              publicationContext: {
                type: publicationType,
                format: '',
                medium: { type: mediaMedium },
                disseminationChannel: '',
              },
            },
          });
          const result = getFormattedRegistration(registration);
          expect(getPages(result)).toBeFalsy();
        });
      });
    });
  });

  it('does not update pages.type to "Range" in any Research Data', () => {
    researchDataTypes.forEach((dataType) => {
      const registration = {
        ...mockRegistration,
        entityDescription: {
          ...mockRegistration.entityDescription,
          reference: {
            publicationContext: {
              type: PublicationType.ResearchData,
            },
            publicationInstance: {
              type: dataType,
              related: [],
              userAgreesToTermsAndConditions: false,
              geographicalCoverage: { type: 'GeographicalDescription', description: 'qwe' },
            },
            compliesWith: ['123'],
            referencedBy: ['456'],
            related: [],
          },
        },
      } as unknown as Registration;
      const result = getFormattedRegistration(registration);
      expect(getPages(result)).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" in any Map', () => {
    [PublicationChannelType.UnconfirmedPublisher, PublicationChannelType.Publisher].forEach((publisher) => {
      const registration = createRegistration({
        instanceType: OtherRegistrationType.Map,
        extra: {
          publicationContext: {
            type: PublicationType.GeographicalContent,
            publisher: { type: publisher },
          },
        },
      });
      const result = getFormattedRegistration(registration);
      expect(getPages(result)).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" in any Exhibition', () => {
    exhibitionProductionSubtypes.forEach((exhibitionSubtype) => {
      const registration = createRegistration({
        contextType: PublicationType.ExhibitionContent,
        extra: {
          publicationInstance: {
            type: ExhibitionContentType.ExhibitionProduction,
            subtype: { type: exhibitionSubtype },
            manifestations: [],
          },
        },
      });
      const result = getFormattedRegistration(registration);
      expect(getPages(result)).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" in any Entity Description without category', () => {
    const registration = {
      ...mockRegistration,
      entityDescription: {
        ...mockRegistration.entityDescription,
        reference: {
          type: 'Reference',
          doi: '12235',
        },
      },
    } as unknown as Registration;
    const result = getFormattedRegistration(registration);
    expect(result.entityDescription?.reference?.publicationInstance).not.toBeDefined();
  });
});

// Type arrays
const publicationTypes = Object.values(PublicationType);
const journalContextTypes = [PublicationChannelType.UnconfirmedJournal, PublicationChannelType.Journal];
const journalTypes = Object.values(JournalType);
const chapterTypes = Object.values(ChapterType);
const mediaContributionPeriodicalTypes = [
  PublicationChannelType.MediaContributionPeriodical,
  PublicationChannelType.UnconfirmedMediaContributionPeriodical,
];
const mediaTypes = Object.values(MediaType);
const mediaFeatureTypes = [MediaType.MediaFeatureArticle, MediaType.MediaReaderOpinion];
const degreeTypes = Object.values(DegreeType);
const bookTypes = Object.values(BookType);
const reportTypes = Object.values(ReportType);
const presentationTypes = Object.values(PresentationType);
const artisticTypes = Object.values(ArtisticType);
const mediaMediums = Object.values(MediaMedium);
const researchDataTypes = Object.values(ResearchDataType);
const exhibitionProductionSubtypes = Object.values(ExhibitionProductionSubtype);

// Helpers
const createRegistration = ({
  contextType,
  instanceType,
  pages,
  extra = {},
}: {
  contextType?: any;
  instanceType?: any;
  pages?: any;
  extra?: any;
} = {}) =>
  ({
    ...mockRegistration,
    entityDescription: {
      ...mockRegistration.entityDescription,
      reference: {
        ...(contextType ? { publicationContext: { type: contextType } } : {}),
        ...(instanceType ? { publicationInstance: { type: instanceType, ...(pages ? { pages } : {}) } } : {}),
        ...extra,
      },
    },
  }) as unknown as Registration;

const getPages = (result: Registration) => {
  const instance = result.entityDescription?.reference?.publicationInstance as { pages?: unknown } | undefined;
  return instance?.pages;
};
