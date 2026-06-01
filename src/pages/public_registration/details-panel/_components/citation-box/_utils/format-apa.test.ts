import { describe, expect, it } from 'vitest';
import { Contributor, ContributorRole } from '../../../../../../types/contributor.types';
import { BookType, ChapterType, JournalType, ReportType } from '../../../../../../types/publicationFieldNames';
import { Registration } from '../../../../../../types/registration.types';
import { formatAPA } from './format-apa';

const buildRegistration = (
  overrides: {
    instanceType?: string;
    contributors?: Contributor[];
    year?: string;
    mainTitle?: string;
    doi?: string;
    handle?: string;
    additionalIdentifiers?: { type: string; sourceName?: string; value: string }[];
    publicationContext?: Record<string, unknown>;
    publicationInstance?: Record<string, unknown>;
  } = {}
) =>
  ({
    handle: overrides.handle,
    additionalIdentifiers: overrides.additionalIdentifiers,
    entityDescription: {
      contributors: overrides.contributors ?? [],
      mainTitle: overrides.mainTitle ?? '',
      publicationDate: { type: 'PublicationDate', year: overrides.year ?? '', month: '', day: '' },
      reference: {
        type: 'Reference',
        doi: overrides.doi ?? '',
        publicationContext: overrides.publicationContext ?? { type: 'Unknown' },
        publicationInstance: {
          type: overrides.instanceType ?? '',
          ...(overrides.publicationInstance ?? {}),
        },
      },
    },
  }) as unknown as Registration;

const buildJournalArticle = (overrides: {
  contributors?: Contributor[];
  year?: string;
  mainTitle?: string;
  volume?: string | null;
  issue?: string | null;
  pages?: { type: 'Range'; begin: string | null; end: string | null } | null;
  doi?: string;
}) =>
  ({
    entityDescription: {
      contributors: overrides.contributors ?? [],
      mainTitle: overrides.mainTitle ?? '',
      publicationDate: { type: 'PublicationDate', year: overrides.year ?? '', month: '', day: '' },
      reference: {
        type: 'Reference',
        doi: overrides.doi ?? '',
        publicationContext: { type: 'Journal' },
        publicationInstance: {
          type: JournalType.AcademicArticle,
          volume: overrides.volume ?? '',
          issue: overrides.issue ?? '',
          pages: overrides.pages ?? { type: 'Range', begin: '', end: '' },
          articleNumber: '',
          corrigendumFor: '',
        },
      },
    },
  }) as unknown as Registration;

describe('formatAPA', () => {
  it('Formats a fully-populated journal article', () => {
    const registration = buildJournalArticle({
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Normann, Ola Henrik' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Mincyte, Diana' },
          role: { type: ContributorRole.Creator },
          sequence: 2,
        },
      ],
      year: '2025',
      mainTitle: 'A Qualitative Comparative Analysis',
      volume: '6',
      issue: '2',
      pages: { type: 'Range', begin: '10', end: '25' },
      doi: 'https://doi.org/10.3389/frsus.2025.1490685',
    });

    expect(formatAPA(registration, { journalName: 'Frontiers in Sustainability' })).toBe(
      'Normann, Ola Henrik, & Mincyte, Diana (2025). A Qualitative Comparative Analysis. Frontiers in Sustainability, 6(2), 10–25. https://doi.org/10.3389/frsus.2025.1490685'
    );
  });

  it('Omits missing volume, issue, and pages without leaving stray punctuation', () => {
    const registration = buildJournalArticle({
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Mincyte, Diana' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2024',
      mainTitle: 'Some Title',
      volume: '',
      issue: '',
      pages: { type: 'Range', begin: '', end: '' },
      doi: 'https://doi.org/10.1000/example',
    });

    expect(formatAPA(registration, { journalName: 'Some Journal' })).toBe(
      'Mincyte, Diana (2024). Some Title. Some Journal. https://doi.org/10.1000/example'
    );
  });

  it('Formats a fully-populated book', () => {
    const registration = buildRegistration({
      instanceType: BookType.AcademicMonograph,
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Smith, Alice' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2023',
      mainTitle: 'A Comprehensive Guide',
      doi: 'https://doi.org/10.1000/book',
      publicationContext: { type: 'Book', isbnList: [], publisher: { type: 'Publisher', id: 'channel-id' } },
    });

    expect(formatAPA(registration, { publisherName: 'Academic Press' })).toBe(
      'Smith, Alice (2023). A Comprehensive Guide. Academic Press. https://doi.org/10.1000/book'
    );
  });

  it('Formats a fully-populated report', () => {
    const registration = buildRegistration({
      instanceType: ReportType.Research,
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Lee, Bo' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2022',
      mainTitle: 'Climate Trends',
      doi: 'https://doi.org/10.1000/report',
      publicationContext: {
        type: 'Report',
        isbnList: [],
        publisher: { type: 'Publisher', id: 'channel-id' },
        seriesNumber: '12',
        onlineIssn: '',
        printIssn: '',
      },
    });

    expect(formatAPA(registration, { publisherName: 'Sikt' })).toBe(
      'Lee, Bo (2022). Climate Trends (Report No. 12). Sikt. https://doi.org/10.1000/report'
    );
  });

  it('Formats a fully-populated book chapter', () => {
    const registration = buildRegistration({
      instanceType: ChapterType.AcademicChapter,
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Smith, Alice' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2021',
      mainTitle: 'On Quantum Theory',
      doi: 'https://doi.org/10.1000/chapter',
      publicationInstance: { pages: { type: 'Range', begin: '15', end: '32' } },
    });

    expect(
      formatAPA(registration, {
        editors: 'R. Editor',
        bookTitle: 'Advances in Physics',
        publisherName: 'Academic Press',
      })
    ).toBe(
      'Smith, Alice (2021). On Quantum Theory. In R. Editor (Ed.), Advances in Physics (pp. 15–32). Academic Press. https://doi.org/10.1000/chapter'
    );
  });

  it.each([
    {
      label: 'book',
      instanceType: BookType.NonFictionMonograph,
      name: 'Smith, Alice',
      year: '2023',
      title: 'Another Book',
    },
    { label: 'report', instanceType: ReportType.Policy, name: 'Lee, Bo', year: '2022', title: 'A Policy Brief' },
    {
      label: 'chapter',
      instanceType: ChapterType.AcademicChapter,
      name: 'Smith, Alice',
      year: '2021',
      title: 'On Quantum Theory',
    },
  ])(
    'Omits missing type-specific fields for a $label, leaving just author, year, and title',
    ({ instanceType, name, year, title }) => {
      const registration = buildRegistration({
        instanceType,
        contributors: [
          {
            type: 'Contributor',
            identity: { type: 'Identity', name },
            role: { type: ContributorRole.Creator },
            sequence: 1,
          },
        ],
        year,
        mainTitle: title,
      });

      expect(formatAPA(registration)).toBe(`${name} (${year}). ${title}.`);
    }
  );

  it('Falls back to a generic citation for an unknown instance type', () => {
    const registration = buildRegistration({
      instanceType: 'SomeFutureType',
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Doe, Jane' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2024',
      mainTitle: 'A Future Resource',
      doi: 'https://doi.org/10.1000/future',
    });

    expect(formatAPA(registration)).toBe('Doe, Jane (2024). A Future Resource. https://doi.org/10.1000/future');
  });

  it('Generic fallback renders without errors when metadata is missing', () => {
    const registration = buildRegistration({ instanceType: 'SomeFutureType' });
    expect(formatAPA(registration)).toBe('');
  });

  it('Uses a handle from additionalIdentifiers when DOI is missing', () => {
    const registration = buildRegistration({
      instanceType: ReportType.Research,
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Lee, Bo' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2022',
      mainTitle: 'A Report',
      additionalIdentifiers: [
        { type: 'HandleIdentifier', sourceName: 'handle', value: 'https://hdl.handle.net/11250/3001' },
      ],
    });

    expect(formatAPA(registration)).toBe('Lee, Bo (2022). A Report. https://hdl.handle.net/11250/3001');
  });
});
