import { ReactNode, useState } from 'react';
import { useDispatch } from 'react-redux';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useTranslation } from 'react-i18next';
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
        },
      },
      queryCache: new QueryCache({
        onError: (error: any, query) => {
          let errorMessage = typeof query.meta?.errorMessage === 'string' ? query.meta.errorMessage : '';
          if (!errorMessage) {
            if (typeof error?.response?.data?.detail === 'string') {
              errorMessage = error.response.data.detail;
            }
            if (!errorMessage) {
              errorMessage = t('feedback.error.an_error_occurred');
            }
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
