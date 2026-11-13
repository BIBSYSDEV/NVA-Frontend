import { DefaultOptions, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { setNotification } from './redux/notificationSlice';

interface QueryProviderProps {
  children: ReactNode;
  /**
   * Overrides merged into the default query options. A test turns retries off through this rather than by supplying a
   * query client of its own, so that it keeps the app behavior.
   */
  defaultOptions?: DefaultOptions;
}

export const QueryProvider = ({ children, defaultOptions }: QueryProviderProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Set queryClient in state to avoid reinitialization for each render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          ...defaultOptions,
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            ...defaultOptions?.queries,
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
