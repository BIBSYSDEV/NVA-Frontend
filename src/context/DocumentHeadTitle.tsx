import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DocumentHeadTitleContextType {
  setPageTitle: (pageTitle: string) => void;
}

export const DocumentHeadTitleContext = createContext<DocumentHeadTitleContextType | undefined>(undefined);

export const TitleProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [pageTitle, setPageTitle] = useState('');

  const appTitle = t('common.page_title');
  const fullTitle = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle;

  return (
    <DocumentHeadTitleContext.Provider value={{ setPageTitle }}>
      <>
        <title>{fullTitle}</title>
        {children}
      </>
    </DocumentHeadTitleContext.Provider>
  );
};

export const useDocumentHeadTitle = (pageTitle?: string) => {
  const context = useContext(DocumentHeadTitleContext);
  if (!context) {
    throw new Error('useTitle must be used within a TitleProvider');
  }

  const { setPageTitle } = context;

  useEffect(() => {
    if (pageTitle) {
      setPageTitle(pageTitle);
      return () => setPageTitle('');
    } else {
      setPageTitle('');
    }
  }, [pageTitle, setPageTitle]);

  return context;
};

interface DocumentHeadTitleProps {
  children?: string;
}

export const DocumentHeadTitle = ({ children }: DocumentHeadTitleProps) => {
  useDocumentHeadTitle(children);
  return null;
};
