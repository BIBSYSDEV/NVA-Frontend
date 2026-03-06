import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { LocalStorageKey } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

const registrationLandingPageParts = UrlPathTemplate.RegistrationWizard.split('/');
const isPublicPage = (path: string) => {
  if (
    path === UrlPathTemplate.Root ||
    path === UrlPathTemplate.Search ||
    path === UrlPathTemplate.Filter ||
    path === UrlPathTemplate.Reports ||
    path.startsWith(UrlPathTemplate.ResearchProfileRoot) ||
    path.startsWith(UrlPathTemplate.ProjectsRoot) ||
    (path.startsWith(`/${registrationLandingPageParts[1]}`) && !path.endsWith(`/${registrationLandingPageParts[3]}`))
  ) {
    return true;
  }
  return false;
};

const Logout = () => {
  const previousPath = localStorage.getItem(LocalStorageKey.RedirectPath);
  const redirectPath = previousPath && isPublicPage(previousPath) ? previousPath : UrlPathTemplate.Root;
  useEffect(() => () => localStorage.removeItem(LocalStorageKey.RedirectPath), []);

  return <Navigate to={redirectPath} replace />;
};

export default Logout;
