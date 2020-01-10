import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

const Workspace: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <h1>{t('list_of_publications')}</h1>
      {/* temporary button so that we can navigate to schema */}
      <Link to="/publications/new">
        <Button color="primary" variant="contained" data-testid="new-schema-button">
          {t('new_publication')}
        </Button>
      </Link>
    </>
  );
};

export default Workspace;
