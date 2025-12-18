import { ScientificValue } from '../../../../types/registration.types';
import { InfoBanner } from '../../../../components/InfoBanner';
import { dataTestId } from '../../../../utils/dataTestIds';
import { useTranslation } from 'react-i18next';

interface NviStatusProps {
  scientificValue?: ScientificValue;
}

export const NviStatus = ({ scientificValue }: NviStatusProps) => {
  const { t } = useTranslation();
  const isNviRated = scientificValue === 'LevelOne' || scientificValue === 'LevelTwo';

  return (
    <InfoBanner
      text={
        isNviRated
          ? t('registration.resource_type.nvi.applicable')
          : t('registration.resource_type.nvi.channel_not_rated')
      }
      data-testid={
        isNviRated
          ? dataTestId.registrationWizard.resourceType.nviSuccess
          : dataTestId.registrationWizard.resourceType.nviFailed
      }
    />
  );
};
