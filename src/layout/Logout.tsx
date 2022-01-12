import { Redirect } from 'react-router-dom';
import { UrlPathTemplate } from '../utils/urlPaths';
import { LocalStorageKey } from '../utils/constants';

const registrationLandingPageParts = UrlPathTemplate.RegistrationLandingPage.split('/');
const isPublicPage = (path: string) => {
  if (
    path === UrlPathTemplate.Home ||
    path === UrlPathTemplate.About ||
    path === UrlPathTemplate.PrivacyPolicy ||
    path.startsWith(UrlPathTemplate.User) ||
    (path.startsWith(`/${registrationLandingPageParts[1]}`) && path.endsWith(`/${registrationLandingPageParts[3]}`))
  ) {
    return true;
  }
  return false;
};

const Logout = () => {
  const previousPath = localStorage.getItem(LocalStorageKey.RedirectPath);
  const redirectPath = previousPath && isPublicPage(previousPath) ? previousPath : UrlPathTemplate.Home;
  localStorage.removeItem(LocalStorageKey.RedirectPath);

  return <Redirect to={redirectPath} />;
};

export default Logout;
