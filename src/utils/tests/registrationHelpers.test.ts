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

const publicationType = [
  PublicationType.PublicationInJournal,
  PublicationType.Book,
  PublicationType.Report,
  PublicationType.Degree,
  PublicationType.Anthology,
  PublicationType.Presentation,
  PublicationType.Artistic,
  PublicationType.MediaContribution,
  PublicationType.ResearchData,
  PublicationType.ExhibitionContent,
  PublicationType.GeographicalContent,
];

// TODO: Test for other aspects of getFormattedRegistration when needed
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
    [PublicationChannelType.UnconfirmedJournal, PublicationChannelType.Journal].forEach((journalContextType) => {
      describe(`category is ${journalContextType}`, () => {
        [
          JournalType.AcademicArticle,
          JournalType.AcademicLiteratureReview,
          JournalType.Letter,
          JournalType.Review,
          JournalType.Leader,
          JournalType.Corrigendum,
          JournalType.Issue,
          JournalType.ConferenceAbstract,
          JournalType.CaseReport,
          JournalType.StudyProtocol,
          JournalType.ProfessionalArticle,
          JournalType.PopularScienceArticle,
        ].forEach((journalType) => {
          describe(`publication instance type is ${journalType}`, () => {
            it('returns registration unchanged if pages is missing', () => {
              const registrationWithoutPages = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: journalContextType },
                    publicationInstance: {
                      type: journalType,
                    },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registrationWithoutPages);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeFalsy();
            });

            it('returns registration unchanged if if pages.type is "Range', () => {
              const registrationWithPages = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: journalContextType },
                    publicationInstance: {
                      type: journalType,
                      pages: { type: 'Range', from: '1', to: '10' },
                    },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registrationWithPages);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeDefined();
              expect((pages as any).type).toBe('Range');
              expect((pages as any).from).toBe('1');
              expect((pages as any).to).toBe('10');
            });

            it('updates pages.type to "Range" if type is missing', () => {
              const registrationWithoutRange = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: journalContextType },
                    publicationInstance: {
                      type: journalType,
                      pages: { from: '1', to: '10' },
                    },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registrationWithoutRange);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeDefined();
              expect((pages as any).type).toBe('Range');
              expect((pages as any).from).toBe('1');
              expect((pages as any).to).toBe('10');
            });

            it('updates pages.type to "Range" if type is not "Range"', () => {
              const registrationWithOtherRange = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: journalContextType },
                    publicationInstance: {
                      type: journalType,
                      pages: { type: 'Other', from: '1', to: '10' },
                    },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registrationWithOtherRange);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeDefined();
              expect((pages as any).type).toBe('Range');
              expect((pages as any).from).toBe('1');
              expect((pages as any).to).toBe('10');
            });
          });
        });
      });
    });

    describe('category is of Anthology-type', () => {
      [
        ChapterType.AcademicChapter,
        ChapterType.NonFictionChapter,
        ChapterType.PopularScienceChapter,
        ChapterType.TextbookChapter,
        ChapterType.EncyclopediaChapter,
        ChapterType.Introduction,
        ChapterType.ExhibitionCatalogChapter,
        ChapterType.ReportChapter,
        ChapterType.ConferenceAbstract,
      ].forEach((chapterType) => {
        describe(`publication instance is is ${chapterType}`, () => {
          it('returns registration unchanged if pages is missing', () => {
            const registration = {
              ...mockRegistration,
              entityDescription: {
                ...mockRegistration.entityDescription,
                reference: {
                  publicationContext: { type: PublicationType.Anthology },
                  publicationInstance: { type: chapterType },
                },
              },
            } as unknown as Registration;
            const result = getFormattedRegistration(registration);
            expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
            const pages = result.entityDescription!.reference!.publicationInstance!.pages;
            expect(pages).toBeFalsy();
          });

          it('returns registration unchanged if if pages.type is "Range', () => {
            const registration = {
              ...mockRegistration,
              entityDescription: {
                ...mockRegistration.entityDescription,
                reference: {
                  publicationContext: { type: PublicationType.Anthology },
                  publicationInstance: { type: chapterType, pages: { type: 'Range', from: '1', to: '10' } },
                },
              },
            } as unknown as Registration;
            const result = getFormattedRegistration(registration);
            expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
            const pages = result.entityDescription!.reference!.publicationInstance!.pages;
            expect(pages).toBeDefined();
            expect((pages as any).type).toBe('Range');
            expect((pages as any).from).toBe('1');
            expect((pages as any).to).toBe('10');
          });

          it('updates pages.type to "Range" if type is missing', () => {
            const registration = {
              ...mockRegistration,
              entityDescription: {
                ...mockRegistration.entityDescription,
                reference: {
                  publicationContext: { type: PublicationType.Anthology },
                  publicationInstance: { type: chapterType, pages: { from: '1', to: '10' } },
                },
              },
            } as unknown as Registration;
            const result = getFormattedRegistration(registration);
            expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
            const pages = result.entityDescription!.reference!.publicationInstance!.pages;
            expect(pages).toBeDefined();
            expect((pages as any).type).toBe('Range');
            expect((pages as any).from).toBe('1');
            expect((pages as any).to).toBe('10');
          });

          it('updates pages.type to "Range" if type is not "Range"', () => {
            const registration = {
              ...mockRegistration,
              entityDescription: {
                ...mockRegistration.entityDescription,
                reference: {
                  publicationContext: { type: PublicationType.Anthology },
                  publicationInstance: { type: chapterType, pages: { type: 'Other', from: '1', to: '10' } },
                },
              },
            } as unknown as Registration;
            const result = getFormattedRegistration(registration);
            expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
            const pages = result.entityDescription!.reference!.publicationInstance!.pages;
            expect(pages).toBeDefined();
            expect((pages as any).type).toBe('Range');
            expect((pages as any).from).toBe('1');
            expect((pages as any).to).toBe('10');
          });
        });
      });
    });

    [
      PublicationChannelType.MediaContributionPeriodical,
      PublicationChannelType.UnconfirmedMediaContributionPeriodical,
    ].forEach((publicationContext) => {
      describe('category is of type Media Contribution Periodical', () => {
        [MediaType.MediaFeatureArticle, MediaType.MediaReaderOpinion].forEach((mediaType) => {
          describe(`publication instance is ${mediaType}`, () => {
            it('returns registration unchanged if pages is missing', () => {
              const registration = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: publicationContext },
                    publicationInstance: { type: mediaType },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registration);
              expect(result).not.toBe(registration);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeFalsy();
            });

            it('returns registration unchanged if if pages.type is "Range', () => {
              const registration = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: publicationContext },
                    publicationInstance: { type: mediaType, pages: { type: 'Range', from: '1', to: '10' } },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registration);
              expect(result).not.toBe(registration);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeDefined();
              expect((pages as any).type).toBe('Range');
              expect((pages as any).from).toBe('1');
              expect((pages as any).to).toBe('10');
            });

            it('updates pages.type to "Range" if type is missing', () => {
              const registration = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: publicationContext },
                    publicationInstance: { type: mediaType, pages: { from: '1', to: '10' } },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registration);
              expect(result).not.toBe(registration);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeDefined();
              expect((pages as any).type).toBe('Range');
              expect((pages as any).from).toBe('1');
              expect((pages as any).to).toBe('10');
            });

            it('updates pages.type to "Range" if type is not "Range"', () => {
              const registration = {
                ...mockRegistration,
                entityDescription: {
                  ...mockRegistration.entityDescription,
                  reference: {
                    publicationContext: { type: publicationContext },
                    publicationInstance: { type: mediaType, pages: { type: 'Other', from: '1', to: '10' } },
                  },
                },
              } as unknown as Registration;
              const result = getFormattedRegistration(registration);
              expect(result).not.toBe(registration);
              expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
              const pages = result.entityDescription!.reference!.publicationInstance!.pages;
              expect(pages).toBeDefined();
              expect((pages as any).type).toBe('Range');
              expect((pages as any).from).toBe('1');
              expect((pages as any).to).toBe('10');
            });
          });
        });
      });
    });
  });

  it('does not update pages.type to "Range" in any Degree', () => {
    publicationType.forEach((publicationChannel) => {
      [
        DegreeType.Bachelor,
        DegreeType.Master,
        DegreeType.Phd,
        DegreeType.ArtisticPhd,
        DegreeType.Licentiate,
        DegreeType.Other,
      ].forEach((degreeType) => {
        const registration = {
          ...mockRegistration,
          entityDescription: {
            ...mockRegistration.entityDescription,
            reference: {
              publicationContext: { type: publicationChannel, isbnList: [], seriesNumber: '' },
              publicationInstance: { type: degreeType, pages: { type: 'MonographPages', pages: '10' } },
            },
          },
        } as unknown as Registration;
        const result = getFormattedRegistration(registration);
        expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
        const pages = result.entityDescription!.reference!.publicationInstance!.pages;
        expect(pages).toBeDefined();
        expect((pages as any).type).toBe('MonographPages');
        expect((pages as any).pages).toBe('10');
      });
    });
  });

  it('does not update pages.type to "Range" in any Book', () => {
    publicationType.forEach((publicationType) => {
      [
        BookType.AcademicMonograph,
        BookType.AcademicCommentary,
        BookType.NonFictionMonograph,
        BookType.PopularScienceMonograph,
        BookType.Textbook,
        BookType.Encyclopedia,
        BookType.ExhibitionCatalog,
        BookType.Anthology,
      ].forEach((bookType) => {
        const registration = {
          ...mockRegistration,
          entityDescription: {
            ...mockRegistration.entityDescription,
            reference: {
              publicationContext: { type: publicationType, isbnList: [], seriesNumber: '' },
              publicationInstance: { type: bookType, pages: { type: 'MonographPages', pages: '10' } },
            },
          },
        } as unknown as Registration;
        const result = getFormattedRegistration(registration);
        expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
        const pages = result.entityDescription!.reference!.publicationInstance!.pages;
        expect(pages).toBeDefined();
        expect((pages as any).type).toBe('MonographPages');
        expect((pages as any).pages).toBe('10');
      });
    });
  });

  it('does not update pages.type to "Range" in any Report', () => {
    publicationType.forEach((publicationType) => {
      [
        ReportType.Research,
        ReportType.Policy,
        ReportType.WorkingPaper,
        ReportType.BookOfAbstracts,
        ReportType.ConferenceReport,
        ReportType.Report,
      ].forEach((reportType) => {
        const registration = {
          ...mockRegistration,
          entityDescription: {
            ...mockRegistration.entityDescription,
            reference: {
              publicationContext: {
                type: publicationType,
                isbnList: [],
                publisher: { type: PublicationChannelType.Publisher },
                seriesNumber: '',
                onlineIssn: '123',
                printIssn: '1225',
              },
              publicationInstance: { type: reportType, pages: { type: 'MonographPages', pages: '10' } },
            },
          },
        } as unknown as Registration;
        const result = getFormattedRegistration(registration);
        expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
        const pages = result.entityDescription!.reference!.publicationInstance!.pages;
        expect(pages).toBeDefined();
        expect((pages as any).type).toBe('MonographPages');
        expect((pages as any).pages).toBe('10');
      });
    });
  });

  it('does not update pages.type to "Range" in any Presentation', () => {
    [
      PresentationType.ConferenceLecture,
      PresentationType.ConferencePoster,
      PresentationType.Lecture,
      PresentationType.OtherPresentation,
    ].forEach((presentationType) => {
      const registration = {
        ...mockRegistration,
        entityDescription: {
          ...mockRegistration.entityDescription,
          reference: {
            publicationContext: {
              type: PublicationType.Presentation,
              name: '',
            },
            publicationInstance: { type: presentationType },
          },
        },
      } as unknown as Registration;
      const result = getFormattedRegistration(registration);
      expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
      const pages = result.entityDescription!.reference!.publicationInstance!.pages;
      expect(pages).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" in any Artistic reference', () => {
    [
      ArtisticType.MusicPerformance,
      ArtisticType.ArtisticDesign,
      ArtisticType.ArtisticArchitecture,
      ArtisticType.VisualArts,
      ArtisticType.PerformingArts,
      ArtisticType.MovingPicture,
      ArtisticType.LiteraryArts,
    ].forEach((artisticType) => {
      const registration = {
        ...mockRegistration,
        entityDescription: {
          ...mockRegistration.entityDescription,
          reference: {
            publicationContext: {
              type: PublicationType.Artistic,
            },
            publicationInstance: { type: artisticType, description: 'aaa' },
          },
        },
      } as unknown as Registration;
      const result = getFormattedRegistration(registration);
      expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
      const pages = result.entityDescription!.reference!.publicationInstance!.pages;
      expect(pages).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" if missing from any Media Contribution Reference', () => {
    publicationType.forEach((publicationType) => {
      [MediaMedium.Journal, MediaMedium.Radio, MediaMedium.TV, MediaMedium.Internet, MediaMedium.Other].forEach(
        (mediaMedium) => {
          [
            MediaType.MediaFeatureArticle,
            MediaType.MediaReaderOpinion,
            MediaType.MediaInterview,
            MediaType.MediaBlogPost,
            MediaType.MediaPodcast,
            MediaType.MediaParticipationInRadioOrTv,
          ].forEach((mediaType) => {
            const registration = {
              ...mockRegistration,
              entityDescription: {
                ...mockRegistration.entityDescription,
                reference: {
                  publicationContext: {
                    type: publicationType,
                    format: '',
                    medium: { type: mediaMedium },
                    disseminationChannel: '',
                  },
                  publicationInstance: { type: mediaType },
                },
              },
            } as unknown as Registration;
            const result = getFormattedRegistration(registration);
            expect(result).not.toBe(registration);
            expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
            const pages = result.entityDescription!.reference!.publicationInstance!.pages;
            expect(pages).toBeFalsy();
          });
        }
      );
    });
  });

  it('does not update pages.type to "Range" in any Research Data', () => {
    [ResearchDataType.DataManagementPlan, ResearchDataType.Dataset].forEach((dataType) => {
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
      expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
      const pages = result.entityDescription!.reference!.publicationInstance!.pages;
      expect(pages).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" in any Map', () => {
    [PublicationChannelType.UnconfirmedPublisher, PublicationChannelType.Publisher].forEach((publisher) => {
      const registration = {
        ...mockRegistration,
        entityDescription: {
          ...mockRegistration.entityDescription,
          reference: {
            publicationContext: {
              type: PublicationType.GeographicalContent,
              publisher: { type: publisher },
            },
            publicationInstance: {
              type: OtherRegistrationType.Map,
            },
          },
        },
      } as unknown as Registration;
      const result = getFormattedRegistration(registration);
      expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
      const pages = result.entityDescription!.reference!.publicationInstance!.pages;
      expect(pages).not.toBeDefined();
    });
  });

  it('does not update pages.type to "Range" in any Exhibition', () => {
    [
      ExhibitionProductionSubtype.BasicExhibition,
      ExhibitionProductionSubtype.TemporaryExhibition,
      ExhibitionProductionSubtype.PopupExhibition,
      ExhibitionProductionSubtype.AmbulatingExhibition,
      ExhibitionProductionSubtype.DigitalExhibition,
      ExhibitionProductionSubtype.HistoricalInterior,
      ExhibitionProductionSubtype.Other,
    ].forEach((exhibitionSubtype) => {
      const registration = {
        ...mockRegistration,
        entityDescription: {
          ...mockRegistration.entityDescription,
          reference: {
            publicationContext: {
              type: PublicationType.ExhibitionContent,
            },
            publicationInstance: {
              type: ExhibitionContentType.ExhibitionProduction,
              subtype: { type: exhibitionSubtype },
              manifestations: [],
            },
          },
        },
      } as unknown as Registration;
      const result = getFormattedRegistration(registration);
      expect(result.entityDescription?.reference?.publicationInstance).toBeDefined();
      const pages = result.entityDescription!.reference!.publicationInstance!.pages;
      expect(pages).not.toBeDefined();
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
