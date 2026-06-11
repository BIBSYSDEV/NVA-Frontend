import { useEffect } from 'react';
import { Navigate } from 'react-router';
import { LocalStorageKey } from '../utils/constants';
import { isPublicPage, UrlPathTemplate } from '../utils/urlPaths';

const Logout = () => {
  const previousPath = localStorage.getItem(LocalStorageKey.RedirectPath);
  const redirectPath = previousPath && isPublicPage(previousPath) ? previousPath : UrlPathTemplate.Root;
  useEffect(() => () => localStorage.removeItem(LocalStorageKey.RedirectPath), []);

  return <Navigate to={redirectPath} replace />;
};

export default Logout;
