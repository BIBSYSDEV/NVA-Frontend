import { VerticalBox } from '../../../../../../components/styled/Wrappers';
import { NviApprovalStatusCounts } from '../../_hooks/useNviInstitutionReportSummary';
import { NviReportLineTypeEnum } from './_components/nvi-report-line/enums';
import { NviReportLine } from './_components/nvi-report-line/NviReportLine';

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
