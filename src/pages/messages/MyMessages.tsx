import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '../../components/PageHeader';

const MyMessages: FC = () => {
  const { t } = useTranslation('workLists');

  return (
    <>
      <PageHeader>{t('my_messages')}</PageHeader>
    </>
  );
};

export default MyMessages;
