import React from 'react';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';

import { BookType, DegreeType, JournalType } from '../../types/publicationFieldNames';

const registrationTypes = [JournalType.ARTICLE, DegreeType.MASTER, BookType.ANTHOLOGY];

export const RegistrationFilters = () => {
  const { t } = useTranslation('common');
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const onClickType = (type: string) => {
    params.set('type', type);
    history.push({ search: params.toString() });
  };

  return (
    <>
      {registrationTypes.map((type) => (
        <Button key={type} disabled={params.get('type') === type} variant="outlined" onClick={() => onClickType(type)}>
          {t(`publicationTypes:${type}`)}
        </Button>
      ))}
    </>
  );
};
