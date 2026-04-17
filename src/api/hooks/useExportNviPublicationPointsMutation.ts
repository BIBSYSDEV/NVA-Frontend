import { useMutation } from '@tanstack/react-query';
import { generateReportFile, ReportProfile } from '../reports-api';

interface ExportNviStatusParams {
  year: number;
  institutionId?: string;
}
export const useExportNviPublicationPointsMutation = () => {
  return useMutation({
    mutationFn: async ({ year, institutionId }: ExportNviStatusParams) => {
      return await generateReportFile({
        year,
        institutionId,
        format: 'text/csv; charset=utf-8',
        profile: ReportProfile.PublicationPoints,
        maxTimeMs: 600000,
      });
    },
  });
};
