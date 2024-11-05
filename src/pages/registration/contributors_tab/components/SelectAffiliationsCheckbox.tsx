import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CristinPerson, CristinPersonAffiliation } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface SelectAffiliationsCheckboxProps {
  cristinPerson: CristinPerson;
  affiliation: CristinPersonAffiliation;
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson | undefined) => void;
  affiliationIsSelected: boolean;
}

export const SelectAffiliationsCheckbox = ({
  cristinPerson,
  affiliation,
  selectedPerson,
  setSelectedPerson,
  affiliationIsSelected,
}: SelectAffiliationsCheckboxProps) => {
  const { t } = useTranslation();

  const selectAffiliation = () => {
    let newAffiliations: CristinPersonAffiliation[];
    let personWithAffiliation: CristinPerson;

    if (selectedPerson && selectedPerson.id === cristinPerson.id) {
      newAffiliations = affiliationIsSelected
        ? selectedPerson.affiliations.filter((a) => a.organization !== affiliation.organization)
        : [...selectedPerson.affiliations, affiliation];
      personWithAffiliation = {
        ...selectedPerson,
        affiliations: newAffiliations,
      };
    } else {
      newAffiliations = [affiliation];
      personWithAffiliation = {
        ...cristinPerson,
        affiliations: newAffiliations,
      };
    }

    setSelectedPerson(personWithAffiliation);
  };

  return (
    <IconButton
      data-testid={dataTestId.registrationWizard.contributors.selectAffiliationForContributor}
      onClick={selectAffiliation}
      color="primary"
      size="small"
      title={t('registration.contributors.select_affiliation')}>
      {affiliationIsSelected ? (
        <CheckBoxIcon fontSize="small" color="info" />
      ) : (
        <CheckBoxOutlineBlankIcon fontSize="small" />
      )}
    </IconButton>
  );
};
