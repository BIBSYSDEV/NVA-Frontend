import React from 'react';
import { Redirect } from 'react-router-dom';
import { UrlPathTemplate } from '../utils/urlPaths';
import { REDIRECT_PATH_KEY } from '../utils/constants';

const registrationLandingPagePath = UrlPathTemplate.RegistrationLandingPage.split('/');
const isPublicPage = (path: string) => {
  if (
    path === UrlPathTemplate.Home ||
    path === UrlPathTemplate.About ||
    path === UrlPathTemplate.PrivacyPolicy ||
    path.startsWith(UrlPathTemplate.User) ||
    (path.startsWith(`/${registrationLandingPagePath[1]}`) && path.endsWith(`/${registrationLandingPagePath[3]}`))
  ) {
    return true;
  }
  return false;
};

const Logout = () => {
  const previousPath = localStorage.getItem(REDIRECT_PATH_KEY);
  const redirectPath = previousPath && isPublicPage(previousPath) ? previousPath : UrlPathTemplate.Home;
  localStorage.removeItem(REDIRECT_PATH_KEY);

  return <Redirect to={redirectPath} />;
};

export default Logout;
