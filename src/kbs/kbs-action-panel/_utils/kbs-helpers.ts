import { KbsInstitution, KbsPatientCounts } from '../kbs.types';

/** Returns the sum of the given patient counts, or null when no counts are given */
export const getPatientsTotal = (patientCounts: Partial<KbsPatientCounts>) => {
  const counts = Object.values(patientCounts).filter((count) => count !== undefined);
  return counts.length > 0 ? counts.reduce((sum, count) => sum + count, 0) : null;
};

export const hasPatientCountForAllInstitutions = (
  institutions: KbsInstitution[],
  patientCounts: Partial<KbsPatientCounts>
): patientCounts is KbsPatientCounts =>
  institutions.every((institution) => patientCounts[institution.id] !== undefined);
