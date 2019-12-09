import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Breadcrumbs as MuiBreadcrumbs, Link as MuiLink } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const StyledBreadcrumbs = styled.div`
  grid-area: breadcrumbs;
  padding: 0.5rem;

  a {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation('breadcrumbs');

  const pathNames = location.pathname.split('/').filter(x => x);

  return (
    <>
      {pathNames.length && (
        <StyledBreadcrumbs>
          <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink component={Link} to="/">
              {t('home')}
            </MuiLink>
            {pathNames.map((pathName, index) => {
              const translatedValue = t(pathName);
              const lastBreadcrumb = index === pathNames.length - 1;
              const to = `/${pathNames.slice(0, index + 1).join('/')}`;
              return lastBreadcrumb ? (
                <MuiLink component={Link} to={to} key={to}>
                  <b>{translatedValue}</b>
                </MuiLink>
              ) : (
                <MuiLink component={Link} to={to} key={to}>
                  {translatedValue}
                </MuiLink>
              );
            })}
          </MuiBreadcrumbs>
        </StyledBreadcrumbs>
      )}
    </>
  );
};

export default Breadcrumbs;
