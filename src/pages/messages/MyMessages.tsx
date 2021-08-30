import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RoleName } from '../../types/user.types';
import { MessagesOverview } from '../worklist/MessagesOverview';

const MyMessages = () => {
  const { t } = useTranslation('workLists');

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('my_messages')}</PageHeader>
      <MessagesOverview role={RoleName.Creator} />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyMessages;
