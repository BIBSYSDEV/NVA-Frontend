import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import InstitutionSelector from '../../pages/user/institution/InstitutionSelector';
import { FormikInstitutionUnitFieldNames, InstitutionUnitBase } from '../../types/institution.types';
import useFetchDepartments from '../../utils/hooks/useFetchDepartments';
import useFetchInstitutions from '../../utils/hooks/useFetchInstitutions';
import { convertToInstitution } from '../../utils/institutions-helpers';
import InstitutionAutocomplete from './InstitutionAutocomplete';

interface EditInstitutionProps {
  initialInstitutionId: string;
}

const EditInstitution: FC<EditInstitutionProps> = ({ initialInstitutionId }) => {
  const [institutions] = useFetchInstitutions();
  const [subunits] = useFetchDepartments(convertToInstitution(initialInstitutionId));
  const initialInstitution = institutions.filter(
    (institution: InstitutionUnitBase) => institution.id === convertToInstitution(initialInstitutionId)
  );
  const { t } = useTranslation('institution');

  return (
    <>
      <InstitutionAutocomplete institutions={initialInstitution} disabled value={initialInstitution.pop() ?? null} />
      <InstitutionSelector
        units={subunits}
        fieldNamePrefix={FormikInstitutionUnitFieldNames.UNIT}
        label={t('institution:department')}
      />
    </>
  );
};

export default EditInstitution;
