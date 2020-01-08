import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

import PublicationPanel from '../publication/PublicationPanel';

const Workspace: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PublicationPanel />
      <Link to="/publications/new">
        <Button color="primary" variant="contained">
          {t('new_publication')}
        </Button>
      </Link>
    </>
  );
};

export default Workspace;
