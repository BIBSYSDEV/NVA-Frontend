import { useFetchOrganization } from '../../api/hooks/useFetchOrganization';
import { Organization } from '../../types/organization.types';
import { findAncestor, findDescendantWithId } from '../../utils/institutions-helpers';
import { SelectInstitutionForm } from './SelectInstitutionForm';

interface SelectInstitutionFormProps {
  affiliationToEdit: Organization;
  editAffiliation: (id: string) => void;
  onClose?: () => void;
}

export const EditInstitutionForm = ({ affiliationToEdit, editAffiliation, onClose }: SelectInstitutionFormProps) => {
  const institution = findAncestor(affiliationToEdit);
  const institutionQuery = useFetchOrganization(institution.id);

  return institutionQuery.isPending ? (
    <div>pending</div>
  ) : institutionQuery.data ? (
    <SelectInstitutionForm
      saveAffiliation={editAffiliation}
      onCancel={onClose}
      initialValues={{
        unit: institutionQuery.data,
        subunit:
          affiliationToEdit.id !== institutionQuery.data.id
            ? findDescendantWithId(institutionQuery.data, affiliationToEdit.id)
            : null,
        selectedSuggestedAffiliationId: '',
      }}
    />
  ) : (
    <div>no data</div>
  );
};
