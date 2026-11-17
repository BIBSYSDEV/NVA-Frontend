import { CristinApiPath } from '../../../../api/apiPaths';
import { makeOrganization } from '../../factories/organization';
import { apiBaseUrl } from '../urls';

const organizationBaseUrl = `${apiBaseUrl}${CristinApiPath.Organization}`;

/**
 * The organizations the shared handlers serve.
 *
 * NOTE: The parent is stated, not derived from the identifier. Cristin identifiers usually encode the hierarchy, but
 * there are exceptions, and `partOf` is a list, so an organization can have parents the identifier cannot express.
 * {@link import('../../../institutions-helpers').getTopLevelOrganization | getTopLevelOrganization} walks `partOf` for
 * that very reason.
 */
export const institutionA = makeOrganization({
  id: `${organizationBaseUrl}/1.0.0.0`,
  labels: { en: 'Institution A', nb: 'Institusjon A' },
});

export const institutionAUnit = makeOrganization({
  id: `${organizationBaseUrl}/1.1.0.0`,
  labels: { en: 'Unit at institution A', nb: 'Enhet ved institusjon A' },
  partOf: [institutionA],
});

export const institutionB = makeOrganization({
  id: `${organizationBaseUrl}/2.0.0.0`,
  labels: { en: 'Institution B', nb: 'Institusjon B' },
});

export const organizations = [institutionA, institutionAUnit, institutionB];
