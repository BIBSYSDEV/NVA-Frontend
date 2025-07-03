import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface HeadTitleContextType {
  setPageTitle: (value: string) => void;
}

const HeadTitleContext = createContext<HeadTitleContextType>({
  setPageTitle: () => {},
});

export const HeadTitleProvider = ({ children }: { children: ReactNode }) => {
  const { t } = useTranslation();
  const [pageTitle, setPageTitle] = useState('');

  const appTitle = t('common.page_title');
  const fullTitle = pageTitle ? `${pageTitle} - ${appTitle}` : appTitle;

  return (
    <HeadTitleContext.Provider value={{ setPageTitle }}>
      <title>{fullTitle}</title>
      {children}
    </HeadTitleContext.Provider>
  );
};

interface HeadTitleProps {
  children?: string;
}

export const HeadTitle = ({ children = '' }: HeadTitleProps) => {
  const { setPageTitle } = useContext(HeadTitleContext);

  useEffect(() => {
    setPageTitle(children);
    return () => {
      setPageTitle('');
    };
  }, [children, setPageTitle]);

  return null;
};
