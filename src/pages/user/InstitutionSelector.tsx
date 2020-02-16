import React, { useState, FC } from 'react';
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
import { Button } from '@material-ui/core';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

interface InstitutionSelectorProps {
  addNewInstitutionUnit: (cristinUnitId: string) => void;
  setOpen: (value: boolean) => void;
}

const InstitutionSelector: FC<InstitutionSelectorProps> = ({ addNewInstitutionUnit, setOpen }) => {
  const { t } = useTranslation('profile');
  const [currentUnit, setCurrentUnit] = useState<InstitutionSubUnit>();
  const [previouslySelectedSubunits, setPreviouslySelectedSubunits] = useState<InstitutionSubUnit[]>([]);
  const [selectedInstitution, setSelectedInstituion] = useState(emptyInstitution);
  const [selectedCristinUnitId, setSelectedCristinUnitId] = useState('');

  const selectInstitution = async (institution: Institution) => {
    const cristinUnitId = institution?.cristinUnitId ?? `${institution.cristinInstitutionId}.0.0.0`;
    setSelectedCristinUnitId(cristinUnitId);
    setSelectedInstituion(institution ?? selectedInstitution);

    setPreviouslySelectedSubunits([]);
    const searchValue = await getInstitutionSubUnit(cristinUnitId);
    if (searchValue) {
      searchValue.subunitSiblings = [...(searchValue.subunits || [])];
    }
    setCurrentUnit(searchValue);
  };

  const searchSubUnits = async (subunitId: string, subunitIndex: number) => {
    setSelectedCristinUnitId(subunitId);
    let listOfSubunits = currentUnit?.subunitSiblings || [];
    if (subunitIndex < previouslySelectedSubunits.length) {
      listOfSubunits = previouslySelectedSubunits[subunitIndex].subunitSiblings || [];
    }
    const searchValue = await getInstitutionSubUnit(subunitId);
    if (searchValue) {
      searchValue.subunitSiblings = [...listOfSubunits];
      setCurrentUnit({ ...searchValue, subunitSiblings: searchValue.subunits });
      setPreviouslySelectedSubunits([...previouslySelectedSubunits, searchValue]);
    }
  };

  const handleAddInstitution = () => {
    addNewInstitutionUnit(selectedCristinUnitId);
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <StyledInstitutionSelector>
        <InstitutionSearch
          dataTestId="autosearch-institution"
          label={t('organization.institution')}
          clearSearchField={selectedInstitution === emptyInstitution}
          setValueFunction={inputValue => selectInstitution(inputValue)}
          placeholder={t('organization.search_for_institution')}
          selectedInstitution={selectedInstitution}
          disabled={false}
        />
        {previouslySelectedSubunits.map((subUnit, index) => {
          return (
            <SubUnitSelect
              searchResults={subUnit.subunitSiblings || []}
              selectedValue={subUnit}
              findSubUnitFunction={cristinUnitId => searchSubUnits(cristinUnitId, index)}
              label={t('organization.faculty')}
              dataTestId={`institution-set-subunit-${index}`}
              key={`instiution-subunit-${index}`}
            />
          );
        })}
        {currentUnit?.subunits && currentUnit.subunits.length > 0 && (
          <SubUnitSelect
            searchResults={currentUnit.subunitSiblings || []}
            selectedValue={emptyInstitutionSubUnit}
            findSubUnitFunction={subunitId => searchSubUnits(subunitId, previouslySelectedSubunits.length)}
            label={t('organization.faculty')}
            dataTestId={`institution-set-subunit-selector`}
          />
        )}
      </StyledInstitutionSelector>
      <StyledButton
        onClick={handleAddInstitution}
        variant="contained"
        color="primary"
        disabled={!selectedCristinUnitId}
        data-testid="institution-add-button">
        {t('common:add')}
      </StyledButton>
      <StyledButton onClick={handleCancel} variant="contained" color="secondary">
        {t('common:cancel')}
      </StyledButton>
    </>
  );
};

export default InstitutionSelector;
