import React, { useState, FC } from 'react';
import { useTranslation } from 'react-i18next';
import InstitutionSearch from '../../publication/references_tab/components/InstitutionSearch';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import { Unit } from '../../../types/institution.types';

const StyledInstitutionSelector = styled.div`
  width: 30rem;
`;

const StyledButton = styled(Button)`
  margin: 0.5rem;
`;

interface InstitutionSelectorProps {
  unit: Unit;
  counter: number;
}

const InstitutionSelector: FC<InstitutionSelectorProps> = ({ unit, counter }) => {
  const { t } = useTranslation('profile');

  // Units.tsx

  const handleAddInstitution = () => {};

  const handleCancel = () => {};

  return (
    <>
      <StyledInstitutionSelector>
        <InstitutionSearch
          dataTestId="autosearch-institution"
          label={t('organization.institution')}
          clearSearchField={selectedInstitution === emptyInstitution}
          setValueFunction={inputValue => selectInstitution(inputValue)}
          placeholder={t('organization.search_for_institution')}
          disabled={false}
        />
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
