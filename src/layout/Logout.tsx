import { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { LocalStorageKey } from '../utils/constants';
import { UrlPathTemplate } from '../utils/urlPaths';

const registrationLandingPageParts = UrlPathTemplate.RegistrationLandingPage.split('/');
const isPublicPage = (path: string) => {
  if (
    path === UrlPathTemplate.Home ||
    path === UrlPathTemplate.About ||
    path === UrlPathTemplate.PrivacyPolicy ||
    path.startsWith(UrlPathTemplate.ResearchProfile) ||
    path.startsWith(UrlPathTemplate.Projects) ||
    (path.startsWith(`/${registrationLandingPageParts[1]}`) && path.endsWith(`/${registrationLandingPageParts[3]}`))
  ) {
    return true;
  }
  return false;
};

const Logout = () => {
  const previousPath = localStorage.getItem(LocalStorageKey.RedirectPath);
  const redirectPath = previousPath && isPublicPage(previousPath) ? previousPath : UrlPathTemplate.Home;
  useEffect(() => () => localStorage.removeItem(LocalStorageKey.RedirectPath), []);

  return <Redirect to={redirectPath} />;
};

export default Logout;
