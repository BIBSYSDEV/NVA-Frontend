import { describe, expect, it } from 'vitest';
import { Affiliation } from '../../types/contributor.types';
import {
  getAffiliationNumbers,
  getAffiliationsToShow,
  removeAffiliation,
  replaceAffiliation,
} from '../contributor-helpers';

const unitA = 'https://api.test.nva.aws.unit.no/cristin/organization/194.0.0.0';
const unitB = 'https://api.test.nva.aws.unit.no/cristin/organization/185.0.0.0';
const unitC = 'https://api.test.nva.aws.unit.no/cristin/organization/215.0.0.0';

const organization = (id: string): Affiliation => ({ type: 'Organization', id });
const unconfirmed = (name: string): Affiliation => ({ type: 'UnconfirmedOrganization', name });

describe('getAffiliationNumbers', () => {
  it('returns the 1-based position of each affiliation in the distinct units', () => {
    expect(getAffiliationNumbers([organization(unitB), organization(unitA)], [unitA, unitB])).toEqual([1, 2]);
  });

  it('only returns each number once when the contributor has the same affiliation several times', () => {
    expect(
      getAffiliationNumbers([organization(unitA), organization(unitB), organization(unitA)], [unitA, unitB])
    ).toEqual([1, 2]);
  });

  it('sorts the numbers numerically', () => {
    const distinctUnits = Array.from({ length: 10 }, (_, index) => `${unitA}-${index}`);
    expect(
      getAffiliationNumbers([organization(distinctUnits[9]), organization(distinctUnits[1])], distinctUnits)
    ).toEqual([2, 10]);
  });

  it('leaves out unconfirmed affiliations and affiliations not in the distinct units', () => {
    expect(getAffiliationNumbers([unconfirmed('Some place'), organization(unitC)], [unitA])).toEqual([]);
  });
});

describe('getAffiliationsToShow', () => {
  it('only includes the first occurrence of each organization, with its original index', () => {
    const affiliations = [organization(unitA), organization(unitB), organization(unitA)];
    expect(getAffiliationsToShow(affiliations)).toEqual([
      { affiliation: organization(unitA), index: 0 },
      { affiliation: organization(unitB), index: 1 },
    ]);
  });

  it('includes all unconfirmed affiliations, even with the same name', () => {
    const affiliations = [unconfirmed('Some place'), unconfirmed('Some place')];
    expect(getAffiliationsToShow(affiliations)).toEqual([
      { affiliation: unconfirmed('Some place'), index: 0 },
      { affiliation: unconfirmed('Some place'), index: 1 },
    ]);
  });
});

describe('removeAffiliation', () => {
  it('removes the affiliation at the given index', () => {
    expect(removeAffiliation([organization(unitA), organization(unitB)], 0)).toEqual([organization(unitB)]);
  });

  it('removes all duplicates of the removed organization', () => {
    const affiliations = [organization(unitA), organization(unitB), organization(unitA)];
    expect(removeAffiliation(affiliations, 0)).toEqual([organization(unitB)]);
  });

  it('only removes the given unconfirmed affiliation, even if another has the same name', () => {
    const affiliations = [unconfirmed('Some place'), unconfirmed('Some place')];
    expect(removeAffiliation(affiliations, 1)).toEqual([unconfirmed('Some place')]);
  });
});

describe('replaceAffiliation', () => {
  it('replaces the affiliation at the given index and keeps the order', () => {
    expect(replaceAffiliation([organization(unitA), organization(unitB)], 0, organization(unitC))).toEqual([
      organization(unitC),
      organization(unitB),
    ]);
  });

  it('removes the duplicates of the replaced organization', () => {
    const affiliations = [organization(unitA), organization(unitB), organization(unitA)];
    expect(replaceAffiliation(affiliations, 0, organization(unitC))).toEqual([
      organization(unitC),
      organization(unitB),
    ]);
  });

  it('removes the duplicates when replacing an organization with itself', () => {
    const affiliations = [organization(unitA), organization(unitA)];
    expect(replaceAffiliation(affiliations, 0, organization(unitA))).toEqual([organization(unitA)]);
  });
});
