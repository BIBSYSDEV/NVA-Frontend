import '../../styles/breadcrumbs.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { mapBreadcrumbName } from '../../utils/mapBreadcrumbName';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const pathNames = location.pathname.split('/').filter(x => x);

  return (
    <div className="breadcrumbs">
      <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link to="/">{t('Home')}</Link>
        {pathNames.map((value, index) => {
          const translatedValue = mapBreadcrumbName(value);
          const lastBreadcrumb = index === pathNames.length - 1;
          const to = `/${pathNames.slice(0, index + 1).join('/')}`;
          return lastBreadcrumb ? (
            <Link to={to} key={to}>
              <b>{translatedValue}</b>
            </Link>
          ) : (
            <Link to={to} key={to}>
              {translatedValue}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
