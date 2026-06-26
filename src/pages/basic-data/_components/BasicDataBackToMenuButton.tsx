import { useTranslation } from 'react-i18next';
import { BackToMenuButton } from '../../../components/side-menu-components/BackToMenuButton';
import { dataTestId } from '../../../utils/dataTestIds';
import { UrlPathTemplate } from '../../../utils/urlPaths';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import { useLocation, useNavigate } from 'react-router';

interface BasicDataBackToMenuButtonProps {
  recreateSearch: boolean;
}

export const BasicDataBackToMenuButton = ({ recreateSearch }: BasicDataBackToMenuButtonProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BackToMenuButton
      data-testid={dataTestId.basicData.backToMenuButton}
      title={t('basic_data.basic_data')}
      to={
        recreateSearch
          ? { pathname: UrlPathTemplate.BasicDataCentralImport, search: location.state?.previousSearch }
          : undefined
      }
      onClick={recreateSearch ? undefined : () => navigate(-1)}>
      <BusinessCenterIcon />
    </BackToMenuButton>
  );
};
