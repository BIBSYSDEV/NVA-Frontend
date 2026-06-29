import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { SearchApiPath } from '../../api/apiPaths';
import { apiRequest2 } from '../../api/apiRequest';
import { buildRegistrationSearchParams, fetchResults, FetchResultsParams } from '../../api/searchApi';
import { setNotification } from '../../redux/notificationSlice';
import { formatDateStringToISO } from '../date-helpers';
import { triggerFileDownload } from '../downloadFileHelpers';
import { PaginatedExportFormat } from './exportFormats';

const pageSize = 25;
const hardCap = 10_000;

const nextLinkRegex = /<([^>]+)>;\s*rel="next"/;

const parseNextLink = (header: string | undefined): string | null => {
  if (!header) return null;
  for (const part of header.split(',')) {
    const match = part.match(nextLinkRegex);
    if (match) return match[1];
  }
  return null;
};

export const useResultsExport = (params: FetchResultsParams) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fetchedCount, setFetchedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const mutation = useMutation({
    mutationFn: async (format: PaginatedExportFormat) => {
      setFetchedCount(0);
      setTotalCount(0);

      const countResponse = await fetchResults({ ...params, from: 0, results: 0 });
      const expectedTotal = Math.min(countResponse.totalHits, hardCap);
      setTotalCount(expectedTotal);

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
          headers: { Accept: format.accept },
          responseType: 'blob',
        });
        chunks.push(await response.data.text());
        fetched += pageSize;
        setFetchedCount(Math.min(fetched, expectedTotal));
        nextUrl = parseNextLink(response.headers.link);
      }

      const currentDate = formatDateStringToISO(new Date());
      return {
        blob: new Blob([format.combine(chunks)], { type: format.mimeType }),
        truncated: nextUrl !== null,
        fileName: `registrations_${currentDate}.${format.fileExtension}`,
      };
    },
    onSuccess: ({ blob, truncated, fileName }) => {
      triggerFileDownload(blob, fileName);
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

  const cappedFetched = Math.min(fetchedCount, totalCount);
  const isDeterminate = totalCount > 0;
  const title = t(mutation.variables?.progressTitleKey ?? 'search.export');
  const progress = {
    title,
    label: isDeterminate ? t('export_progress_count', { fetched: cappedFetched, total: totalCount }) : title,
    value: isDeterminate ? (cappedFetched / totalCount) * 100 : undefined,
  };

  return {
    exportResults: mutation.mutate,
    isExporting: mutation.isPending,
    progress,
  };
};
