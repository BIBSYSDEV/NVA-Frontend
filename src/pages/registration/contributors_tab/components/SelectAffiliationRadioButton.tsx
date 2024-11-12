import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CristinPerson, CristinPersonAffiliation } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface SelectAffiliationRadioButtonProps {
  cristinPerson: CristinPerson;
  affiliation: CristinPersonAffiliation;
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson | undefined) => void;
  affiliationIsSelected: boolean;
  disabled?: boolean;
}

export const SelectAffiliationRadioButton = ({
  cristinPerson,
  affiliation,
  selectedPerson,
  setSelectedPerson,
  affiliationIsSelected,
  disabled = false,
}: SelectAffiliationRadioButtonProps) => {
  const { t } = useTranslation();

  const selectAffiliation = () => {
    let newAffiliations: CristinPersonAffiliation[];
    let personWithAffiliation: CristinPerson;

    if (selectedPerson && selectedPerson.id === cristinPerson.id) {
      newAffiliations = affiliationIsSelected
        ? selectedPerson.affiliations.filter((a) => a.organization !== affiliation.organization)
        : [affiliation];

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
      disabled={disabled}
      title={t('registration.contributors.select_affiliation')}>
      {affiliationIsSelected ? <CheckCircle fontSize="small" color="info" /> : <CircleOutlined fontSize="small" />}
    </IconButton>
  );
};
