import { describe, expect, test } from 'vitest';
import { emptyJournalPublicationInstance } from '../../../types/publication_types/journalRegistration.types';
import { makeContributor } from '../factories/contributor';
import { makeCustomerInstitution } from '../factories/customer-institution';
import { makeImportCandidateSummary } from '../factories/import-candidate';
import { makeRegistration } from '../factories/registration';

/**
 * The factories below build on shared module constants from the app's own types. Each one clones that constant, so a
 * test that mutates what it was given cannot leak into the next test. Without the clone the leak surfaces far from its
 * cause, as an unrelated test failing depending on the order tests ran in.
 *
 * A new factory belongs here when the constant it builds on has at least one nested object or array. A flat constant
 * such as `emptyEmployment` is left out on purpose: there is nothing to leak, so the test would pass whether or not
 * the factory clones.
 */
describe('factories built on shared constants', () => {
  test('makeRegistration does not share nested objects between registrations', () => {
    const registration = makeRegistration();
    const otherRegistration = makeRegistration();

    registration.entityDescription!.mainTitle = 'Changed';

    expect(otherRegistration.entityDescription?.mainTitle).not.toBe('Changed');
  });

  test('makeCustomerInstitution does not share nested objects between customer institutions', () => {
    const customerInstitution = makeCustomerInstitution();
    const otherCustomerInstitution = makeCustomerInstitution();

    customerInstitution.rightsRetentionStrategy.policyUri = 'https://sikt.no/policy';

    expect(otherCustomerInstitution.rightsRetentionStrategy.policyUri).not.toBe('https://sikt.no/policy');
  });

  test('makeContributor does not share nested objects between contributors', () => {
    const contributor = makeContributor();
    const otherContributor = makeContributor();

    contributor.identity.name = 'Changed';

    expect(otherContributor.identity.name).not.toBe('Changed');
  });

  test('makeImportCandidateSummary does not hand out the shared empty publication instance', () => {
    expect(makeImportCandidateSummary().publicationInstance).not.toBe(emptyJournalPublicationInstance);
  });
});
