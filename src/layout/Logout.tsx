import React from 'react';
import { Redirect } from 'react-router-dom';
import { UrlPathTemplate } from '../utils/urlPaths';
import { LOGIN_REDIRECT_PATH_KEY } from '../utils/constants';

const isPublicPage = (path: string) => {
  if (
    path === UrlPathTemplate.Home ||
    path === UrlPathTemplate.About ||
    path === UrlPathTemplate.PrivacyPolicy ||
    path.startsWith(UrlPathTemplate.User) ||
    (path.startsWith(UrlPathTemplate.Registration) && path.endsWith('/public'))
  ) {
    return true;
  }
  return false;
};

const Logout = () => {
  const previousPath = localStorage.getItem(LOGIN_REDIRECT_PATH_KEY);
  const redirectPath = previousPath && isPublicPage(previousPath) ? previousPath : UrlPathTemplate.Home;
  localStorage.removeItem(LOGIN_REDIRECT_PATH_KEY);

  return <Redirect to={redirectPath} />;
};

export default Logout;
