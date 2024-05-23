import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from './redux/notificationSlice';

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Set queryClient in state to avoid reinitialization for each render
  const [queryClient] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
      queryCache: new QueryCache({
        onError: (error, query) => {
          const queryErrorMessage = query.meta?.errorMessage;
          const handleError = query.meta?.handleError;
          if (handleError && typeof handleError === 'function') {
            handleError(error, query);
            return;
          }

          if (queryErrorMessage === false) {
            return;
          }

          let errorMessage = typeof queryErrorMessage === 'string' ? queryErrorMessage : '';
          if (!errorMessage) {
            errorMessage = t('feedback.error.an_error_occurred');
          }
          dispatch(setNotification({ message: errorMessage, variant: 'error' }));
        },
      }),
    })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};
