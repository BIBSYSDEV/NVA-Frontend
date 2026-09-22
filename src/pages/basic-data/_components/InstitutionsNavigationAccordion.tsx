import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { SelectableCreateButton } from '../../../components/buttons/SelectableCreateButton';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NavigationList } from '../../../components/_atoms/NavigationList';
import { SelectableButton } from '../../../components/buttons/SelectableButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { checkWhichBasicDataPage } from '../../../utils/location-helpers/check-which-basic-data-page';
import { getAdminInstitutionPath, UrlPathTemplate } from '../../../utils/urlPaths';

export const InstitutionsNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isOnInstitutionsPage, isOnNewInstitutionPage } = checkWhichBasicDataPage(location.pathname, location.search);

  return (
    <NavigationListAccordion
      title={t('common.institutions')}
      startIcon={<AccountBalanceIcon sx={{ bgcolor: 'grey.500' }} />}
      accordionPath={UrlPathTemplate.BasicDataInstitutions}
      dataTestId={dataTestId.basicData.institutionsAccordion}>
      <NavigationList aria-label={t('common.institutions')}>
        <SelectableButton
          data-testid={dataTestId.basicData.adminInstitutionsLink}
          isSelected={isOnInstitutionsPage && !isOnNewInstitutionPage}
          to={UrlPathTemplate.BasicDataInstitutions}>
          {t('common.institutions')}
        </SelectableButton>
      </NavigationList>
      <Divider sx={{ mt: '0.5rem' }} />
      <SelectableCreateButton
        data-testid={dataTestId.basicData.addCustomerLink}
        isSelected={isOnNewInstitutionPage}
        selectedColor="grey.500"
        to={getAdminInstitutionPath('new')}
        title={t('basic_data.institutions.add_institution')}
      />
    </NavigationListAccordion>
  );
};
