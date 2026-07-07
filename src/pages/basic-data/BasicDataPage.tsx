import BusinessCenterIcon from '@mui/icons-material/BusinessCenterOutlined';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation } from 'react-router';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { NavigationListAccordion } from '../../components/NavigationListAccordion';
import { StyledPageWithSideMenu } from '../../components/side-menu-components/_utils/side-menu-styles';
import { SideNavHeader } from '../../components/side-menu-components/SideNavHeader';
import { SideMenu } from '../../components/side-menu-components/SideMenu';
import { dataTestId } from '../../utils/dataTestIds';
import { useLoggedInUser } from '../../utils/hooks/useLoggedInUser';
import { checkWhichBasicDataPage } from '../../utils/location-helpers/check-which-basic-data-page';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { checkUserRoles } from '../../utils/user-helpers';
import { ImportCandidatesMenuFilters } from '../basic_data/app_admin/central_import/ImportCandidatesMenuFilters';
import { BasicDataBackToMenuButton } from './_components/BasicDataBackToMenuButton';
import { ChannelClaimAccordion } from './_components/ChannelClaimAccordion';
import { InstitutionsNavigationAccordion } from './_components/InstitutionsNavigationAccordion';
import { NviAdminNavigationAccordion } from './_components/NviAdminNavigationAccordion';
import { PersonRegisterNavigationAccordion } from './_components/PersonRegisterNavigationAccordion';

const BasicDataPage = () => {
  const { t } = useTranslation();
  const user = useLoggedInUser();
  const location = useLocation();
  const { isInstitutionAdmin, isAppAdmin, isInternalImporter } = checkUserRoles(user);
  const { isOnCentralImportEditPage, isOnCentralImportMergePage, isOnACentralImportSubPage } = checkWhichBasicDataPage(
    location.pathname,
    location.search
  );

  return (
    <StyledPageWithSideMenu>
      <SideMenu
        isVisible={!isOnACentralImportSubPage}
        backToSideMenuButton={
          // INFO: CentralImportEditPage and CentralImportMergePage are two levels deep, so for them we want to go back to the landing page of central import (one level back) instead of going back to the search
          <BasicDataBackToMenuButton recreateSearch={!isOnCentralImportEditPage && !isOnCentralImportMergePage} />
        }>
        <SideNavHeader icon={BusinessCenterIcon} text={t('basic_data.basic_data')} />
        {isInstitutionAdmin && <PersonRegisterNavigationAccordion />}
        {isAppAdmin && (
          <>
            <InstitutionsNavigationAccordion />
            <NviAdminNavigationAccordion />
            <ChannelClaimAccordion />
          </>
        )}
        {isInternalImporter && (
          <NavigationListAccordion
            title={t('basic_data.central_import.central_import')}
            startIcon={<FilterDramaIcon sx={{ bgcolor: 'centralImport.main' }} />}
            accordionPath={UrlPathTemplate.BasicDataCentralImport}
            dataTestId={dataTestId.basicData.centralImportAccordion}>
            <ImportCandidatesMenuFilters />
          </NavigationListAccordion>
        )}
      </SideMenu>

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </StyledPageWithSideMenu>
  );
};

export default BasicDataPage;
