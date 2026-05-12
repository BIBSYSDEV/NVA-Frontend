import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { SearchApiPath } from '../../api/apiPaths';
import { apiRequest2 } from '../../api/apiRequest';
import { ResultParam } from '../../api/searchApi';
import { triggerFileDownload } from '../downloadFileHelpers';

const maxNumberOfCitations = 500;

export const useBibtexExport = () => {
  const [searchParams] = useSearchParams();

  const mutation = useMutation({
    mutationFn: async () => {
      const exportParams = new URLSearchParams(searchParams);
      exportParams.set(ResultParam.From, '0');
      exportParams.set(ResultParam.Results, maxNumberOfCitations.toString());

      const response = await apiRequest2<Blob>({
        url: `${SearchApiPath.Registrations}?${exportParams.toString()}`,
        headers: { Accept: 'text/x-bibtex' },
        responseType: 'blob',
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const currentDate = new Date().toLocaleDateString();
      triggerFileDownload(blob, `registrations_${currentDate}.bib`);
    },
  });

  return { exportBibTex: mutation.mutate, isFetchingBibtex: mutation.isPending };
};
