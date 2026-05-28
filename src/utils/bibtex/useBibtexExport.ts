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

const pageSize = 200;
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

export const useBibtexExport = (params: FetchResultsParams) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [fetchedCount, setFetchedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const mutation = useMutation({
    mutationFn: async () => {
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
          headers: { Accept: 'text/x-bibtex' },
          responseType: 'blob',
        });
        chunks.push(await response.data.text());
        fetched += pageSize;
        setFetchedCount(Math.min(fetched, expectedTotal));
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

  const cappedFetched = Math.min(fetchedCount, totalCount);
  const isDeterminate = totalCount > 0;
  const progress = {
    title: t('search.exporting_bibtex'),
    label: isDeterminate
      ? t('search.export_progress_count', { fetched: cappedFetched, total: totalCount })
      : t('search.exporting_bibtex'),
    value: isDeterminate ? (cappedFetched / totalCount) * 100 : undefined,
  };

  return {
    exportBibTex: mutation.mutate,
    isFetchingBibtex: mutation.isPending,
    progress,
  };
};
