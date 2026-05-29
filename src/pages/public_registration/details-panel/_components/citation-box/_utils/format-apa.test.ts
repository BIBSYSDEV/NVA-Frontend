import { describe, expect, it } from 'vitest';
import { Contributor, ContributorRole } from '../../../../../../types/contributor.types';
import { JournalType } from '../../../../../../types/publicationFieldNames';
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
