import { lazy } from 'react';
import { Route, Routes } from 'react-router';
import { Layout } from './Layout';
import { MaintenanceMessagePage } from './pages/errorpages/MaintenanceMessagePage';
import { UrlPathTemplate } from './utils/urlPaths';

const CopyrightActTerms = lazy(() => import('./pages/infopages/CopyrightActTerms'));

const MaintenanceModeApp = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path={UrlPathTemplate.CopyrightAct} element={<CopyrightActTerms />} />
        <Route path="*" element={<MaintenanceMessagePage />} />
      </Route>
    </Routes>
  );
};
export default MaintenanceModeApp;
