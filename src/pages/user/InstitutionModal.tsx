import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { emptyInstitution, Institution, InstitutionSubUnit } from '../../types/references.types';
import InstitutionSearch from '../publication/references_tab/components/InstitutionSearch';
import { useDispatch } from 'react-redux';
import { setInstitution } from '../../redux/actions/institutionActions';
import { Button } from '@material-ui/core';
import SubUnitSelect from './SubUnitSelect';
import { getInstitutionSubUnit } from './../../api/InstitutionApi';
import { emptyInstitutionSubUnit } from './../../types/references.types';

const InstitutionModal: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [faculties, setFaculties] = useState<InstitutionSubUnit[]>([]);
  const [institutes, setInstitutes] = useState<InstitutionSubUnit[]>([]);
  const [selectedInstitution, setSelectedInstituion] = useState(emptyInstitution);
  const [selectedFaculty, setSelectedFaculty] = useState(emptyInstitutionSubUnit);
  const [selectedInstitute, setSelectedInstitute] = useState(emptyInstitutionSubUnit);

  const addInstitution = (institution: Institution) => dispatch(setInstitution(institution));

  const getSubUnits = async (searchValue: string, setValueFunction: (value: any) => void) => {
    const response = await getInstitutionSubUnit(searchValue);
    if (response) {
      setValueFunction(response);
    }
  };

  const searchFaculties = (institution: Institution) => {
    setSelectedInstituion(institution ?? selectedInstitution);
    setFaculties([]);
    setSelectedFaculty(emptyInstitutionSubUnit);
    setInstitutes([]);
    setSelectedInstitute(emptyInstitutionSubUnit);
    setSelectedInstitute(emptyInstitutionSubUnit);
    getSubUnits(institution.cristinUnitId, setFaculties);
  };

  const searchInstitutes = (faculty: InstitutionSubUnit) => {
    setInstitutes([]);
    setSelectedInstitute(emptyInstitutionSubUnit);
    setSelectedFaculty(faculty);
    getSubUnits(faculty.cristinUnitId, setInstitutes);
  };

  return (
    <div>
      <p>{t('change_institution')}</p>
      <p>{selectedInstitution?.title}</p>
      <p>{selectedFaculty?.unitNames[0].name}</p>
      <p>{selectedInstitute?.unitNames[0].name}</p>
      <InstitutionSearch
        clearSearchField={selectedInstitution === emptyInstitution}
        dataTestId="autosearch-institution"
        label={t('references.institution')}
        setValueFunction={inputValue => searchFaculties(inputValue)}
        placeholder={t('references.search_for_institution')}
      />
      <SubUnitSelect searchResults={faculties} selectedValue={selectedFaculty} valueFunction={searchInstitutes} />
      <SubUnitSelect
        searchResults={institutes}
        selectedValue={selectedInstitute}
        valueFunction={setSelectedInstitute}
      />
      <Button
        onClick={() => {
          addInstitution(selectedInstitution);
        }}>
        Add
      </Button>
    </div>
  );
};

export default InstitutionModal;
