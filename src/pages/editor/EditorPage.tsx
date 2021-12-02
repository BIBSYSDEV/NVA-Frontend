import { useTranslation } from 'react-i18next';
import { PageHeader } from '../../components/PageHeader';
import { StyledPageWrapperWithMaxWidth } from '../../components/styled/Wrappers';
import { VocabularySettings } from './VocabularySettings';

const EditorPage = () => {
  const { t } = useTranslation('editor');

  return (
    <StyledPageWrapperWithMaxWidth>
      <PageHeader>{t('profile:roles.editor')}</PageHeader>
      <VocabularySettings />
    </StyledPageWrapperWithMaxWidth>
  );
};

export default EditorPage;
