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
import { Button } from '@material-ui/core';
import { InstitutionUnit } from './../../types/institution.types';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

interface InstitutionSelectorProps {
  institutionUnit: InstitutionUnit;
  disabled: boolean;
  addNewInstitutionUnit: (cristinUnitId: string) => void;
  setOpen: (value: boolean) => void;
}

const InstitutionSelector: React.FC<InstitutionSelectorProps> = ({
  disabled,
  addNewInstitutionUnit,
  institutionUnit,
  setOpen,
}) => {
  const { t } = useTranslation('profile');
  const [subUnits, setSubUnits] = useState<InstitutionSubUnit[]>([]);
  const [selectedInstitution, setSelectedInstituion] = useState(emptyInstitution);
  const [subUnitSelector, setSubUnitSelector] = useState<InstitutionSubUnit>();
  const [selectedCristinUnitId, setSelectedCristinUnitId] = useState(institutionUnit?.cristinUnitId || '');

  const getSubUnit = async (cristinUnitId: string) => {
    const response: InstitutionSubUnit = await getInstitutionSubUnit(cristinUnitId);
    if (response) {
      return response;
    }
  };

  const selectInstitution = async (institution: Institution) => {
    const institutionId = institution.cristinInstitutionId;
    const cristinUnitId = institution?.cristinUnitId ?? `${institutionId}.0.0.0`;
    setSelectedCristinUnitId(cristinUnitId);
    setSelectedInstituion(institution ?? selectedInstitution);
    setSubUnits([]);
    const searchValue = await getSubUnit(cristinUnitId);
    if (searchValue) {
      searchValue.subunitSiblings = [...(searchValue.subunits || [])];
    }
    setSubUnitSelector(searchValue);
  };

  const searchSubUnits = async (subUnit: string, index: number) => {
    setSelectedCristinUnitId(subUnit);
    let oldSearchValues = subUnitSelector?.subunitSiblings || [];
    if (index < subUnits.length) {
      oldSearchValues = subUnits[index].subunitSiblings || [];
    }
    const searchValue = await getSubUnit(subUnit);
    if (searchValue) {
      searchValue.subunitSiblings = [...oldSearchValues];
      setSubUnitSelector({ ...searchValue, subunitSiblings: searchValue.subunits });

      const newSubUnits = [...subUnits].splice(0, index);

      setSubUnits([...newSubUnits, searchValue]);
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
          disabled={disabled}
        />
        {subUnits.map((subUnit, index) => {
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
        {subUnitSelector?.subunits && subUnitSelector.subunits.length > 0 && (
          <SubUnitSelect
            searchResults={subUnitSelector.subunitSiblings || []}
            selectedValue={emptyInstitutionSubUnit}
            findSubUnitFunction={subUnitSelector => searchSubUnits(subUnitSelector, subUnits.length)}
            label={t('organization.faculty')}
            dataTestId={`institution-set-subunit-selector`}
          />
        )}
      </StyledInstitutionSelector>
      <StyledButton
        onClick={() => handleAddInstitution()}
        variant="contained"
        color="primary"
        disabled={!selectedCristinUnitId}
        data-testid="institution-add-button">
        {t('common:add')}
      </StyledButton>
      <StyledButton
        onClick={() => {
          handleCancel();
        }}
        variant="contained"
        color="secondary">
        {t('common:cancel')}
      </StyledButton>
    </>
  );
};

export default InstitutionSelector;
