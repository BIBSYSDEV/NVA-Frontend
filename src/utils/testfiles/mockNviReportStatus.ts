import { ReportStatusResponse } from '../../api/scientificIndexApi';

export const mockNviReportStatus: ReportStatusResponse = {
  publicationId: '12345679',
  period: '2025',
  reportStatus: {
    status: 'NOT_CANDIDATE',
  },
};
