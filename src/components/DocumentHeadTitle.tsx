import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DocumentHeadTitleContextType {
  setPageTitle: (pageTitle: string) => void;
}
const DocumentHeadTitleContext = createContext<DocumentHeadTitleContextType>({
  setPageTitle: () => {},
});

export const DocumentHeadTitleProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [pageTitle, setPageTitle] = useState('');

  const appTitle = t('common.page_title');
  const fullTitle = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle;

  return (
    <DocumentHeadTitleContext.Provider value={{ setPageTitle }}>
      <title>{fullTitle}</title>
      {children}
    </DocumentHeadTitleContext.Provider>
  );
};

const useDocumentHeadTitle = (pageTitle = '') => {
  const { setPageTitle } = useContext(DocumentHeadTitleContext);

  useEffect(() => {
    setPageTitle(pageTitle);
  }, [pageTitle, setPageTitle]);

  return null;
};

interface DocumentHeadTitleProps {
  children?: string;
}

export const DocumentHeadTitle = ({ children }: DocumentHeadTitleProps) => {
  useDocumentHeadTitle(children);
  return null;
};
