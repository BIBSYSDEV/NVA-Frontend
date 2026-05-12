import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'react-router';
import { SearchApiPath } from '../../api/apiPaths';
import { apiRequest2 } from '../../api/apiRequest';
import { ResultParam } from '../../api/searchApi';

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
    onSuccess: (blob) => downloadBibTexFile(blob),
  });

  return { exportBibTex: mutation.mutate, isFetchingBibtex: mutation.isPending };
};

const downloadBibTexFile = (blob: Blob) => {
  const url = URL.createObjectURL(blob);
  const currentDate = new Date().toLocaleDateString();

  const link = document.createElement('a');
  link.href = url;
  link.download = `registrations_${currentDate}.bib`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
