import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { RoleName } from '../../types/user.types';
import { MessagesOverview } from '../worklist/MessagesOverview';

const MyMessages = () => {
  const { t } = useTranslation('workLists');

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('messages')}</PageHeader>
      <MessagesOverview role={RoleName.CREATOR} />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default MyMessages;
