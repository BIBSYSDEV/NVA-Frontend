import { createContext } from 'react';

interface LandingPageContextProps {
  isAwaitingStatusSync: boolean;
  setIsAwaitingStatusSync: (value: boolean) => void;
}

export const LandingPageContext = createContext<LandingPageContextProps>({
  isAwaitingStatusSync: false,
  setIsAwaitingStatusSync: () => {},
});
