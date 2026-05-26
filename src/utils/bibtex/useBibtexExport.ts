import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { SearchApiPath } from '../../api/apiPaths';
import { apiRequest2 } from '../../api/apiRequest';
import { buildRegistrationSearchParams, FetchResultsParams } from '../../api/searchApi';
import { setNotification } from '../../redux/notificationSlice';
import { formatDateStringToISO } from '../date-helpers';
import { triggerFileDownload } from '../downloadFileHelpers';

const pageSize = 200;
const hardCap = 6000;

const parseNextLink = (header: string | undefined): string | null => {
  if (!header) return null;
  for (const part of header.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="next"/);
    if (match) return match[1];
  }
  return null;
};

export const useBibtexExport = (params: FetchResultsParams) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async () => {
      const initialParams = buildRegistrationSearchParams({
        ...params,
        from: 0,
        results: pageSize,
      });
      let nextUrl: string | null = `${SearchApiPath.Registrations}?${initialParams.toString()}`;
      const chunks: string[] = [];
      let fetched = 0;

      while (nextUrl && fetched < hardCap) {
        const response = await apiRequest2<Blob>({
          url: nextUrl,
          headers: { Accept: 'text/x-bibtex' },
          responseType: 'blob',
        });
        chunks.push(await response.data.text());
        fetched += pageSize;
        nextUrl = parseNextLink(response.headers.link);
      }

      return { blob: new Blob([chunks.join('\n')], { type: 'text/x-bibtex' }), truncated: nextUrl !== null };
    },
    onSuccess: ({ blob, truncated }) => {
      const currentDate = formatDateStringToISO(new Date());
      triggerFileDownload(blob, `registrations_${currentDate}.bib`);
      if (truncated) {
        dispatch(
          setNotification({
            message: t('export_limit_reached', { limit: hardCap }),
            variant: 'warning',
          })
        );
      }
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.download_file'), variant: 'error' })),
  });

  return { exportBibTex: mutation.mutate, isFetchingBibtex: mutation.isPending };
};
