import { NviReportLineTypeEnum } from '../../../../../components/nvi-report-line/enums';
import { NviReportLine } from '../../../../../components/nvi-report-line/NviReportLine';
import { VerticalBox } from '../../../../../components/styled/Wrappers';
import { NviApprovalStatusCounts } from '../_hooks/useNviInstitutionReportSummary';

interface NviReportNumbersProps {
  isLoading: boolean;
  numbers: NviApprovalStatusCounts;
}

export const NviReportNumbers = ({ isLoading, numbers }: NviReportNumbersProps) => {
  return (
    <VerticalBox sx={{ mt: '1rem', mb: '0.5rem', gap: '0.15rem' }}>
      <NviReportLine type={NviReportLineTypeEnum.Candidates} count={numbers.new ?? '0'} isLoading={isLoading} />
      <NviReportLine type={NviReportLineTypeEnum.Controlling} count={numbers.pending ?? '0'} isLoading={isLoading} />
      <NviReportLine type={NviReportLineTypeEnum.Approved} count={numbers.approved ?? '0'} isLoading={isLoading} />
      <NviReportLine type={NviReportLineTypeEnum.Rejected} count={numbers.rejected ?? '0'} isLoading={isLoading} />
    </VerticalBox>
  );
};
