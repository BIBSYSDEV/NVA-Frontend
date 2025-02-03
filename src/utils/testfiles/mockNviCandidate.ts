import { NviCandidate } from '../../types/nvi.types';

export const mockNviCandidate: NviCandidate = {
  id: 'https://api.dev.nva.aws.unit.no/scientific-index/candidate/1',
  publicationId: '12345679',
  approvals: [],
  notes: [],
  period: {
    status: 'OpenPeriod',
  },
  allowedOperations: ['approval/approve-candidate', 'approval/reject-candidate', 'approval/reset-approval'],
};
