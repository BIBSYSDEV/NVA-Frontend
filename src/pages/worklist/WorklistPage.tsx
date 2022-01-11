import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { MessagesOverview } from './MessagesOverview';
import { RoleName } from '../../types/user.types';

const WorklistPage = () => {
  const { t } = useTranslation('workLists');

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('worklist')}</PageHeader>
      <MessagesOverview role={RoleName.CURATOR} />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default WorklistPage;
