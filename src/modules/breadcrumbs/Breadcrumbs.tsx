import '../../styles/breadcrumbs.scss';

import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathNames = location.pathname.split('/').filter(x => x);
  return (
    <div className="breadcrumbs">
      <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link to="/">Home</Link>
        {pathNames.map((value, index) => {
          const lastBreadcrumb = index === pathNames.length - 1;
          const to = `/${pathNames.slice(0, index + 1).join('/')}`;
          return lastBreadcrumb ? (
            <Link to={to} key={to}>
              <b>{value}</b>
            </Link>
          ) : (
            <Link to={to} key={to}>
              {value}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
