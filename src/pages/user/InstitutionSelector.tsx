import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  emptyInstitution,
  Institution,
  InstitutionSubUnit,
  emptyInstitutionSubUnit,
} from '../../types/institution.types';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import SubUnitSelect from './SubUnitSelect';
import { getInstitutionSubUnit } from '../../api/institutionApi';
import styled from 'styled-components';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

interface InstitutionSelectorProps {
  setSelectedCristinUnitId: (value: string) => void;
  disabled: boolean;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({ setSelectedCristinUnitId, disabled }) => {
  const { t } = useTranslation('profile');
  const [subUnits, setSubUnits] = useState<InstitutionSubUnit[]>([]);
  const [selectedInstitution, setSelectedInstituion] = useState(emptyInstitution);
  const [subUnitSelector, setSubUnitSelector] = useState<InstitutionSubUnit>();

  const getSubUnit = async (cristinUnitId: string) => {
    const newSubUnit: InstitutionSubUnit = emptyInstitutionSubUnit;

    const response: InstitutionSubUnit[] = await getInstitutionSubUnit(cristinUnitId);
    if (response) {
      newSubUnit.subUnits = response;
    }

    return newSubUnit;
  };

  const selectInstitution = async (institution: Institution) => {
    setSelectedCristinUnitId(institution.cristinUnitId);
    setSelectedInstituion(institution ?? selectedInstitution);
    setSubUnits([]);
    const searchValue = await getSubUnit(institution.cristinUnitId);
    setSubUnitSelector(searchValue);
  };

  const searchSubUnits = async (newSubUnit: InstitutionSubUnit, index: number) => {
    setSelectedCristinUnitId(newSubUnit.cristinUnitId);
    const oldSearchValues = subUnitSelector?.subUnits || [];
    const searchValue = await getSubUnit(newSubUnit.cristinUnitId);
    newSubUnit.subUnits = [...oldSearchValues];
    setSubUnitSelector(searchValue);

    if (index === 0) {
      setSubUnits([newSubUnit]);
    } else {
      const newSubUnits = subUnits.slice(0, index);
      setSubUnits([...newSubUnits, newSubUnit]);
    }
  };

  return (
    <StyledInstitutionSelector>
      <InstitutionSearch
        clearSearchField={selectedInstitution === emptyInstitution}
        dataTestId="autosearch-institution"
        label={t('organization.institution')}
        setValueFunction={inputValue => selectInstitution(inputValue)}
        placeholder={t('organization.search_for_institution')}
        selectedInstitution={selectedInstitution}
        disabled={disabled}
      />
      {subUnits.map((subUnit, index) => {
        return (
          <SubUnitSelect
            searchResults={subUnit.subUnits || []}
            selectedValue={subUnit}
            findSubUnitFunction={subUnit => searchSubUnits(subUnit, index)}
            label={t('organization.faculty')}
            dataTestId={`institution-set-subunit-${index}`}
            key={`instiution-subunit-${index}`}
          />
        );
      })}
      {subUnitSelector?.subUnits && subUnitSelector.subUnits.length > 0 && (
        <SubUnitSelect
          searchResults={subUnitSelector?.subUnits || []}
          selectedValue={subUnitSelector}
          findSubUnitFunction={subUnitSelector => searchSubUnits(subUnitSelector, subUnits.length)}
          label={t('organization.faculty')}
          dataTestId={`institution-set-subunit-selector`}
        />
      )}
    </StyledInstitutionSelector>
  );
};

export default InstitutionSelector;
