import { describe, expect, it } from 'vitest';
import { Contributor, ContributorRole } from '../../../../../../types/contributor.types';
import { BookType, JournalType, ReportType } from '../../../../../../types/publicationFieldNames';
import { Registration } from '../../../../../../types/registration.types';
import { formatAPA } from './format-apa';

const buildRegistration = (
  overrides: {
    instanceType?: string;
    contributors?: Contributor[];
    year?: string;
    mainTitle?: string;
    doi?: string;
    publicationContext?: Record<string, unknown>;
    publicationInstance?: Record<string, unknown>;
  } = {}
) =>
  ({
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
      'Normann, O. H., & Mincyte, D. (2025). A Qualitative Comparative Analysis. Frontiers in Sustainability, 6(2), 10–25. https://doi.org/10.3389/frsus.2025.1490685'
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
      'Mincyte, D. (2024). Some Title. Some Journal. https://doi.org/10.1000/example'
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
      'Smith, A. (2023). A Comprehensive Guide. Academic Press. https://doi.org/10.1000/book'
    );
  });

  it('Omits missing publisher and DOI for a book', () => {
    const registration = buildRegistration({
      instanceType: BookType.NonFictionMonograph,
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Smith, Alice' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2023',
      mainTitle: 'Another Book',
    });

    expect(formatAPA(registration)).toBe('Smith, A. (2023). Another Book.');
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
      'Lee, B. (2022). Climate Trends (Report No. 12). Sikt. https://doi.org/10.1000/report'
    );
  });

  it('Omits missing report number, publisher, and DOI for a report', () => {
    const registration = buildRegistration({
      instanceType: ReportType.Policy,
      contributors: [
        {
          type: 'Contributor',
          identity: { type: 'Identity', name: 'Lee, Bo' },
          role: { type: ContributorRole.Creator },
          sequence: 1,
        },
      ],
      year: '2022',
      mainTitle: 'A Policy Brief',
    });

    expect(formatAPA(registration)).toBe('Lee, B. (2022). A Policy Brief.');
  });

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

    expect(formatAPA(registration)).toBe('Doe, J. (2024). A Future Resource. https://doi.org/10.1000/future');
  });

  it('Generic fallback renders without errors when metadata is missing', () => {
    const registration = buildRegistration({ instanceType: 'SomeFutureType' });
    expect(formatAPA(registration)).toBe('');
  });
});
