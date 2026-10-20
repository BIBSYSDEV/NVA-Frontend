import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KbsAssessmentAnswer, KbsPatientCounts, KbsReport, KbsStatus } from '../kbs-action-panel/kbs.types';
import { createDefaultKbsReport, readKbsReport, writeKbsReport } from '../_utils/kbs-mock-storage';
import { getKbsReportAfterPeriodClose } from '../_utils/kbs-period-helpers';

export const useKbsReport = (projectId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ['kbsReport', projectId];

  // NOTE: The data is read synchronously from localStorage, so it is always available
  const { data: kbsReport } = useQuery({
    queryKey,
    queryFn: () => readKbsReport(projectId),
    initialData: () => readKbsReport(projectId),
    staleTime: Infinity,
  });

  const kbsReportMutation = useMutation({
    mutationFn: async (updatedKbsReport: KbsReport) => {
      writeKbsReport(projectId, updatedKbsReport);
      return updatedKbsReport;
    },
    onSuccess: (updatedKbsReport) => queryClient.setQueryData(queryKey, updatedKbsReport),
  });

  const updateKbsReport = (changes: Partial<KbsReport>) => kbsReportMutation.mutate({ ...kbsReport, ...changes });

  const saveAssessment = (answer: KbsAssessmentAnswer) => {
    // TODO: The other answers are waiting for design
    const status = answer === KbsAssessmentAnswer.Yes ? KbsStatus.Candidate : kbsReport.status;
    updateKbsReport({ assessmentAnswer: answer, status });
  };

  const deliverPatientCounts = (patientCounts: KbsPatientCounts) =>
    updateKbsReport({ patientCounts, status: KbsStatus.Delivered });

  const setIsProjectActive = (isProjectActive: boolean) => updateKbsReport({ isProjectActive });

  const setHasKbsApproval = (hasKbsApproval: boolean) => updateKbsReport({ hasKbsApproval });

  const closeKbsPeriod = () => kbsReportMutation.mutate(getKbsReportAfterPeriodClose(kbsReport));

  const resetKbsReport = () => kbsReportMutation.mutate(createDefaultKbsReport());

  return {
    ...kbsReport,
    saveAssessment,
    deliverPatientCounts,
    setIsProjectActive,
    setHasKbsApproval,
    closeKbsPeriod,
    resetKbsReport,
  };
};

export type KbsReportState = ReturnType<typeof useKbsReport>;
