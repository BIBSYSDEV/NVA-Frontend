import { useMutation } from '@tanstack/react-query';
import { generateReportFile, ReportProfile } from '../reportsApi';

interface ExportNviStatusParams {
  year: number;
  institutionId: string;
}
export const useExportNviAuthorSharesMutation = () => {
  return useMutation({
    mutationFn: async ({ year, institutionId }: ExportNviStatusParams) => {
      const file = await generateReportFile({
        year,
        institutionId,
        format: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        profile: ReportProfile.AuthorShares,
        maxTimeMs: 600000,
      });

      return file;
    },
  });
};
