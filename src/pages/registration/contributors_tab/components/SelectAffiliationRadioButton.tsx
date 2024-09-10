import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleOutlined from '@mui/icons-material/CircleOutlined';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CristinPerson, CristinPersonAffiliation } from '../../../../types/user.types';
import { dataTestId } from '../../../../utils/dataTestIds';

interface SelectAffiliationRadioButtonProps {
  personIsSelected: boolean;
  affiliation: CristinPersonAffiliation;
  selectedPerson?: CristinPerson;
  setSelectedPerson: (selectedContributor: CristinPerson | undefined) => void;
  affiliationIsSelected: boolean;
}

export const SelectAffiliationRadioButton = ({
  affiliation,
  selectedPerson,
  setSelectedPerson,
  affiliationIsSelected,
  personIsSelected,
}: SelectAffiliationRadioButtonProps) => {
  const { t } = useTranslation();

  const selectAffiliation = () => {
    if (!selectedPerson) {
      return;
    }
    const newAffiliations = affiliationIsSelected
      ? selectedPerson.affiliations.filter((a) => a.organization !== affiliation.organization)
      : [affiliation];

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
      {affiliationIsSelected ? <CheckCircle fontSize="small" color="info" /> : <CircleOutlined fontSize="small" />}
    </IconButton>
  );
};
