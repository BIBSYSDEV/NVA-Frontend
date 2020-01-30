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
import InstitutionPresentation from './InstitutionPresentation';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

interface InstitutionSelectorProps {
  setSelectedCristinUnitId: (value: string) => void;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({ setSelectedCristinUnitId }) => {
  const { t } = useTranslation('profile');
  const [faculties, setFaculties] = useState<InstitutionSubUnit[]>([]);
  const [institutes, setInstitutes] = useState<InstitutionSubUnit[]>([]);
  const [selectedInstitution, setSelectedInstituion] = useState(emptyInstitution);
  const [selectedFaculty, setSelectedFaculty] = useState(emptyInstitutionSubUnit);
  const [selectedInstitute, setSelectedInstitute] = useState(emptyInstitutionSubUnit);

  const getSubUnits = async (searchValue: string, setStateFunction: (value: InstitutionSubUnit[]) => void) => {
    const response = await getInstitutionSubUnit(searchValue);
    if (response) {
      setStateFunction(response);
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
    setSelectedCristinUnitId(institution.cristinUnitId);
    setSelectedInstituion(institution ?? selectedInstitution);
    resetFaculty();
    getSubUnits(institution.cristinUnitId, setFaculties);
  };

  const searchInstitutes = (faculty: InstitutionSubUnit) => {
    setSelectedCristinUnitId(faculty.cristinUnitId);
    setSelectedFaculty(faculty);
    resetInstitute();
    getSubUnits(faculty.cristinUnitId, setInstitutes);
  };

  const setInstitute = (subUnit: InstitutionSubUnit) => {
    setSelectedInstitute(subUnit);
    setSelectedCristinUnitId(subUnit.cristinUnitId);
  };

  return (
    <StyledInstitutionSelector>
      <InstitutionPresentation
        institution={selectedInstitution.institutionNames}
        level1={selectedFaculty.unitNames}
        level2={selectedInstitute.unitNames}
      />
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
        findSubUnitFunction={searchInstitutes}
        label={t('organization.faculty')}
        dataTestId="institution-set-subunit-1"
      />
      <SubUnitSelect
        searchResults={institutes}
        selectedValue={selectedInstitute}
        findSubUnitFunction={setInstitute}
        label={t('organization.institute')}
        dataTestId="institution-set-subunit-2"
      />
    </StyledInstitutionSelector>
  );
};

export default InstitutionSelector;
