import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KbsAssessmentAnswer, KbsPatientCounts, KbsReport, KbsStatus } from '../kbs-action-panel/kbs.types';
import { readKbsReport, writeKbsReport } from '../_utils/kbs-mock-storage';

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

  return { ...kbsReport, saveAssessment, deliverPatientCounts };
};

export type KbsReportState = ReturnType<typeof useKbsReport>;
