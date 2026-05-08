import { DirectAffiliationAggregation, NviInstitutionStatusResponse } from '../../../../types/nvi.types';
import { Organization } from '../../../../types/organization.types';

/**
 * Checks if an organization has at least one NVI candidate.
 * @param orgAggregations - The aggregation data for the organization
 * @returns true if the organization has one or more candidates, false otherwise
 */
const orgHasCandidates = (orgAggregations?: DirectAffiliationAggregation) =>
  orgAggregations && orgAggregations.candidateCount > 0;

/**
 * Checks if an organization has NVI point values — either publication points or approved publications.
 * @param orgAggregations - The aggregation data for the organization
 * @returns true if the organization has points or at least one globally approved publication
 */
const orgHasPointValues = (orgAggregations?: DirectAffiliationAggregation) =>
  orgAggregations && (orgAggregations.points > 0 || orgAggregations.globalApprovalStatus.Approved > 0);

/**
 * Recursively checks if an organization or any of its descendants have NVI candidates.
 * @param organization - The organization to check, including its hasPart tree
 * @param aggregations - The NVI status response containing candidate counts per organization
 * @returns true if the organization itself or any descendant has at least one candidate
 */
export const selfOrDescendantHasCandidates = (
  organization: Omit<Organization, 'acronym'>,
  aggregations: NviInstitutionStatusResponse | undefined
): boolean => {
  if (orgHasCandidates(aggregations?.byOrganization[organization.id])) return true;
  return organization.hasPart?.some((subUnit) => selfOrDescendantHasCandidates(subUnit, aggregations)) ?? false;
};

/**
 * Recursively checks if an organization or any of its descendants have NVI point values.
 * @param organization - The organization to check, including its hasPart tree
 * @param aggregations - The NVI status response containing point values per organization
 * @returns true if the organization itself or any descendant has points or globally approved publications
 */
export const selfOrDescendantHasPointValues = (
  organization: Omit<Organization, 'acronym'>,
  aggregations: NviInstitutionStatusResponse | undefined
): boolean => {
  if (orgHasPointValues(aggregations?.byOrganization[organization.id])) return true;
  return organization.hasPart?.some((subUnit) => selfOrDescendantHasPointValues(subUnit, aggregations)) ?? false;
};
