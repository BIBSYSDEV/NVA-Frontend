import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { emptyInstitution, Institution, InstitutionSubUnit } from '../../types/references.types';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import SubUnitSelect from './SubUnitSelect';
import { getInstitutionSubUnit } from '../../api/InstitutionApi';
import { emptyInstitutionSubUnit } from '../../types/references.types';
import styled from 'styled-components';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

interface InstitutionSelectorProps {
  valueFunction: (value: string) => void;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({ valueFunction }) => {
  const { t } = useTranslation('profile');
  const [faculties, setFaculties] = useState<InstitutionSubUnit[]>([]);
  const [institutes, setInstitutes] = useState<InstitutionSubUnit[]>([]);
  const [selectedInstitution, setSelectedInstituion] = useState(emptyInstitution);
  const [selectedFaculty, setSelectedFaculty] = useState(emptyInstitutionSubUnit);
  const [selectedInstitute, setSelectedInstitute] = useState(emptyInstitutionSubUnit);

  const getSubUnits = async (searchValue: string, setValueFunction: (value: any) => void) => {
    const response = await getInstitutionSubUnit(searchValue);
    if (response) {
      setValueFunction(response);
    }
  };

  const resetInstitute = () => {
    setInstitutes([]);
    setSelectedInstitute(emptyInstitutionSubUnit);
  };

  const resetFaculty = () => {
    setFaculties([]);
    setSelectedFaculty(emptyInstitutionSubUnit);
    resetInstitute();
  };

  const searchFaculties = (institution: Institution) => {
    valueFunction(institution.cristinUnitId);
    setSelectedInstituion(institution ?? selectedInstitution);
    resetFaculty();
    getSubUnits(institution.cristinUnitId, setFaculties);
  };

  const searchInstitutes = (faculty: InstitutionSubUnit) => {
    valueFunction(faculty.cristinUnitId);
    setSelectedFaculty(faculty);
    resetInstitute();
    getSubUnits(faculty.cristinUnitId, setInstitutes);
  };

  const setInstitute = (subUnit: InstitutionSubUnit) => {
    setSelectedInstitute(subUnit);
    valueFunction(subUnit.cristinUnitId);
  };

  return (
    <StyledInstitutionSelector>
      <p>{selectedInstitution?.title}</p>
      <p>{selectedFaculty?.unitNames[0].name}</p>
      <p>{selectedInstitute?.unitNames[0].name}</p>
      <InstitutionSearch
        clearSearchField={selectedInstitution === emptyInstitution}
        dataTestId="autosearch-institution"
        label={t('organization.institution')}
        setValueFunction={inputValue => searchFaculties(inputValue)}
        placeholder={t('organization.search_for_institution')}
      />
      <SubUnitSelect
        searchResults={faculties}
        selectedValue={selectedFaculty}
        valueFunction={searchInstitutes}
        label={t('organization.faculty')}
      />
      <SubUnitSelect
        searchResults={institutes}
        selectedValue={selectedInstitute}
        valueFunction={setInstitute}
        label={t('organization.institute')}
      />
    </StyledInstitutionSelector>
  );
};

export default InstitutionSelector;
