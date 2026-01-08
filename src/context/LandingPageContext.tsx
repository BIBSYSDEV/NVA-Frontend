import { createContext } from 'react';

interface LandingPageContextProps {
  disableEdit: boolean;
  setDisableEdit: (value: boolean) => void;
}

export const LandingPageContext = createContext<LandingPageContextProps>({
  disableEdit: false,
  setDisableEdit: () => {},
});
