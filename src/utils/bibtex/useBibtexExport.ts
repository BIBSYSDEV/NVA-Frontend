import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { SearchApiPath } from '../../api/apiPaths';
import { apiRequest2 } from '../../api/apiRequest';
import { buildRegistrationSearchParams, FetchResultsParams } from '../../api/searchApi';
import { setNotification } from '../../redux/notificationSlice';
import { formatDateStringToISO } from '../date-helpers';
import { triggerFileDownload } from '../downloadFileHelpers';

const maxNumberOfCitations = 100;

export const useBibtexExport = (params: FetchResultsParams) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: async () => {
      const searchParams = buildRegistrationSearchParams({
        ...params,
        from: 0,
        results: maxNumberOfCitations,
      });

      const response = await apiRequest2<Blob>({
        url: `${SearchApiPath.Registrations}?${searchParams.toString()}`,
        headers: { Accept: 'text/x-bibtex' },
        responseType: 'blob',
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const currentDate = formatDateStringToISO(new Date());
      triggerFileDownload(blob, `registrations_${currentDate}.bib`);
    },
    onError: () => dispatch(setNotification({ message: t('feedback.error.download_file'), variant: 'error' })),
  });

  return { exportBibTex: mutation.mutate, isFetchingBibtex: mutation.isPending };
};
