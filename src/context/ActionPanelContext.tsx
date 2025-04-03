import { createContext } from 'react';

interface ActionPanelContextProps {
  refetchData: () => Promise<void>;
}

export const ActionPanelContext = createContext<ActionPanelContextProps>({
  refetchData: async () => {},
});
