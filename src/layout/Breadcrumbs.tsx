import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Link as MuiLink, Breadcrumbs as MuiBreadcrumbs } from '@material-ui/core';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const StyledBreadcrumbs = styled.div`
  grid-area: breadcrumbs;
  padding: 0.5rem;

  a {
    color: ${({ theme }) => theme.palette.text.secondary};
  }
`;

const Breadcrumbs: FC = () => {
  const { pathname, state } = useLocation();
  const { t } = useTranslation('breadcrumbs');
  const pathNames = pathname.split('/').filter((x) => x);

  return (
    <>
      {pathNames.length > 0 && (
        <StyledBreadcrumbs>
          <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <MuiLink component={Link} to="/">
              {t('home')}
            </MuiLink>
            {pathNames.map((pathName: string, index: number) => {
              const isId = pathName.match('[\\d+]');
              const translatedValue = isId && state?.title ? state.title : t(pathName);
              const lastBreadcrumb = index === pathNames.length - 1;
              const to = `/${pathNames.slice(0, index + 1).join('/')}`;
              return lastBreadcrumb ? (
                <b key={to}>{translatedValue}</b>
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
