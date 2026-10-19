import { useState } from 'react';
import { KbsAssessmentAnswer, KbsPatientCounts, KbsStatus } from '../kbs-action-panel/kbs.types';

export const useKbsReport = () => {
  // TODO: Read from the mocked KBS data
  const [status, setStatus] = useState(KbsStatus.NotAssessed);
  const [year] = useState(new Date().getFullYear());
  const [patientCounts, setPatientCounts] = useState<Partial<KbsPatientCounts>>({});

  const saveAssessment = (answer: KbsAssessmentAnswer) => {
    // TODO: The other answers are waiting for design
    if (answer === KbsAssessmentAnswer.Yes) {
      setStatus(KbsStatus.Candidate);
    }
  };

  const deliverPatientCounts = (deliveredPatientCounts: KbsPatientCounts) => {
    setPatientCounts(deliveredPatientCounts);
    setStatus(KbsStatus.Delivered);
  };

  return { status, year, patientCounts, saveAssessment, deliverPatientCounts };
};

export type KbsReport = ReturnType<typeof useKbsReport>;
