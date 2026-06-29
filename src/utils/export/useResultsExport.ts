import { useMutation } from '@tanstack/react-query';
import { isCancel } from 'axios';
import { useRef, useState } from 'react';
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

/**
 * Bulk-exports registration search results in a given file format.
 *
 * The matching results are fetched page by page (following the `link: rel="next"`
 * header) up to a hard cap of {@link hardCap} results, then each format's
 * {@link PaginatedExportFormat.combine} merges the pages into a single file that is
 * downloaded in the browser. If more results exist than the cap allows, the export is
 * truncated and the user is notified.
 *
 * The export format is supplied per invocation via the returned `exportResults`
 * callback, so a single hook instance can drive several format options (e.g. a menu).
 *
 * @param params - Search parameters describing which results to export. The `from` and
 *   `results` values are overridden internally for paging and the total count lookup.
 * @returns
 *   - `exportResults`: starts an export for the given {@link PaginatedExportFormat}.
 *   - `cancelExport`: aborts the in-progress export without showing an error.
 *   - `isExporting`: whether an export is currently running.
 *   - `progress`: title, label and percentage (`undefined` while indeterminate) for a progress dialog.
 */
export const useResultsExport = (params: FetchResultsParams) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fetchedCount, setFetchedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const mutation = useMutation({
    mutationFn: async (format: PaginatedExportFormat) => {
      setFetchedCount(0);
      setTotalCount(0);

      const abortController = new AbortController();
      abortControllerRef.current = abortController;
      const { signal } = abortController;

      const countResponse = await fetchResults({ ...params, from: 0, results: 0 }, signal);
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
          signal,
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
    onError: (error) => {
      if (isCancel(error)) {
        return; // User aborted the export; no error feedback needed.
      }
      dispatch(setNotification({ message: t('feedback.error.download_file'), variant: 'error' }));
    },
  });

  const cancelExport = () => abortControllerRef.current?.abort();

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
    cancelExport,
    isExporting: mutation.isPending,
    progress,
  };
};
