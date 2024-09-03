import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CristinPerson, CristinPersonAffiliation } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface SelectAffiliationsCheckboxProps {
  personIsSelected: boolean;
  affiliation: CristinPersonAffiliation;
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson | undefined) => void;
  affiliationIsSelected: boolean;
}

export const SelectAffiliationsCheckbox = ({
  affiliation,
  selectedPerson,
  setSelectedPerson,
  affiliationIsSelected,
  personIsSelected,
}: SelectAffiliationsCheckboxProps) => {
  const { t } = useTranslation();

  const selectAffiliation = () => {
    if (!selectedPerson) {
      return;
    }
    const newAffiliations = affiliationIsSelected
      ? selectedPerson.affiliations.filter((a) => a.organization !== affiliation.organization)
      : [...selectedPerson.affiliations, affiliation];

    const personWithAffiliation: CristinPerson = {
      ...selectedPerson,
      affiliations: newAffiliations,
    };
    setSelectedPerson(personWithAffiliation);
  };

  return (
    <IconButton
      data-testid={dataTestId.registrationWizard.contributors.selectAffiliationForContributor}
      onClick={selectAffiliation}
      color="primary"
      size="small"
      disabled={!personIsSelected}
      title={t('registration.contributors.select_affiliation')}>
      {affiliationIsSelected ? (
        <CheckBoxIcon fontSize="small" color="info" />
      ) : (
        <CheckBoxOutlineBlankIcon fontSize="small" />
      )}
    </IconButton>
  );
};
