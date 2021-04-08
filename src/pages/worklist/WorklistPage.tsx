import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { MessagesOverview } from './MessagesOverview';
import { RoleName } from '../../types/user.types';

const WorklistPage = () => {
  const { t } = useTranslation('workLists');

  return (
    <StyledPageWrapperWithMaxWidth>
      <Helmet>
        <title>{t('my_worklist')}</title>
      </Helmet>
      <PageHeader>{t('my_worklist')}</PageHeader>
      <MessagesOverview role={RoleName.CURATOR} />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default WorklistPage;
