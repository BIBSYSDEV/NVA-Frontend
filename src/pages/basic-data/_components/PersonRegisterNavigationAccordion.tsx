import PeopleIcon from '@mui/icons-material/People';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { SelectableCreateButton } from '../../../components/buttons/SelectableCreateButton';
import { NavigationListAccordion } from '../../../components/NavigationListAccordion';
import { NavigationList } from '../../../components/_atoms/NavigationList';
import { SelectableButton } from '../../../components/buttons/SelectableButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { checkWhichBasicDataPage } from '../../../utils/location-helpers/check-which-basic-data-page';
import { UrlPathTemplate } from '../../../utils/urlPaths';

export const PersonRegisterNavigationAccordion = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isOnPersonRegisterPage, isOnAddEmployeePage } = checkWhichBasicDataPage(location.pathname, location.search);

  return (
    <NavigationListAccordion
      title={t('basic_data.person_register.person_register')}
      startIcon={<PeopleIcon sx={{ bgcolor: 'person.main' }} />}
      accordionPath={UrlPathTemplate.BasicDataPersonRegister}
      dataTestId={dataTestId.basicData.personRegisterAccordion}>
      <NavigationList aria-label={t('basic_data.person_register.person_register')}>
        <SelectableButton
          data-testid={dataTestId.basicData.personRegisterLink}
          isSelected={isOnPersonRegisterPage}
          to={UrlPathTemplate.BasicDataPersonRegister}>
          {t('basic_data.person_register.person_register')}
        </SelectableButton>
      </NavigationList>

      <Divider sx={{ mt: '0.5rem' }} />

      <SelectableCreateButton
        data-testid={dataTestId.basicData.addEmployeeLink}
        variant="outlined"
        isSelected={isOnAddEmployeePage}
        selectedColor="tertiary.dark"
        to={UrlPathTemplate.BasicDataAddEmployee}
        title={t('basic_data.add_employee.add_employee')}
      />
    </NavigationListAccordion>
  );
};
