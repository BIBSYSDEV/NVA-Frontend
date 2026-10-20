export enum KbsStatus {
  NotAssessed = 'NotAssessed',
  Candidate = 'Candidate',
  Delivered = 'Delivered',
  Reported = 'Reported',
}

export enum KbsAssessmentAnswer {
  No = 'No',
  YesButInclusionsNotThisYear = 'YesButInclusionsNotThisYear',
  Yes = 'Yes',
}

export interface KbsInstitution {
  id: string;
  name: string;
}

export type KbsPatientCounts = Record<KbsInstitution['id'], number>;

export enum KbsRole {
  ProjectLeader = 'ProjectLeader',
  KbsAdmin = 'KbsAdmin',
  LocalResponsible = 'LocalResponsible',
  ProjectMember = 'ProjectMember',
  Anonymous = 'Anonymous',
}

export interface KbsReport {
  status: KbsStatus;
  year: number;
  assessmentAnswer?: KbsAssessmentAnswer;
  patientCounts: Partial<KbsPatientCounts>;
  isProjectActive: boolean;
  hasKbsApproval: boolean;
}
