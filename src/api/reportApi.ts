import { ReportApiPath } from './apiPaths';
import { authenticatedApiRequest2 } from './apiRequest';

export const fetchExportNviData = async (year: number) => {
  const fetchNviExportResponse = await authenticatedApiRequest2({
    url: `${ReportApiPath.InstitutionNviApproval}/${year}`,
  });
  return fetchNviExportResponse.data;
};
