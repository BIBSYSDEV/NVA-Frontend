import {
  computeParamsFromDropdownStatus,
  computeDropdownStatusFromParams,
  createPageSpecificAmountString,
} from './nviUtils';
import { describe, expect, it } from 'vitest';
import { NviCandidateStatusEnum, NviCandidateGlobalStatusEnum } from '../../api/searchApi';
import {
  NviCandidateApprovalStatusEnum,
  NviCandidateSearchHitApproval,
  NviSearchStatusEnum,
} from '../../types/nvi.types';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { TFunction } from 'i18next';

describe('computeDropdownStatusFromParams', () => {
  describe("status: pending and globalStatus: pending'", () => {
    it('returns the search status "candidates for control"', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending],
        [NviCandidateGlobalStatusEnum.Pending]
      );
      expect(res).toEqual([NviSearchStatusEnum.CandidatesForControl]);
    });
  });
  describe('status: approved and globalStatus: approved and pending', () => {
    it('returns the search status approved', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Approved],
        [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending]
      );
      expect(res).toEqual([NviSearchStatusEnum.Approved]);
    });
  });
  describe('status: rejected and globalStatus: rejected and pending', () => {
    it('returns the search status rejected', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Rejected],
        [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending]
      );
      expect(res).toEqual([NviSearchStatusEnum.Rejected]);
    });
  });
  describe('status:pending and approved and globalStatus: pending and approved', () => {
    it('returns the search status candidates for control and approved', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved],
        [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Approved]
      );
      expect(res).toEqual([NviSearchStatusEnum.CandidatesForControl, NviSearchStatusEnum.Approved]);
    });
  });
  describe('status: pending, rejected and globalStatus: pending, rejected', () => {
    it('returns the search status candidates for control and rejected', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Rejected],
        [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Rejected]
      );
      expect(res).toEqual([NviSearchStatusEnum.CandidatesForControl, NviSearchStatusEnum.Rejected]);
    });
  });
  describe('status: approved, rejected and globalStatus: approved, pending, rejected', () => {
    it('returns the search status approved and rejected', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected],
        [
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Rejected,
        ]
      );
      expect(res).toEqual([NviSearchStatusEnum.Approved, NviSearchStatusEnum.Rejected]);
    });
  });
  describe('status: pending, approved, rejected and globalStatus: pending, approved, rejected', () => {
    it('returns the correct states', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected],
        [
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Rejected,
        ]
      );
      expect(res).toEqual([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Approved,
        NviSearchStatusEnum.Rejected,
      ]);
    });
  });
});

describe('computeParamsFromDropdownStatus', () => {
  describe("Dropdown status is 'Kandidater for kontroll'", () => {
    it('returns pending statuses', () => {
      const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.CandidatesForControl]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending],
        newGlobalStatuses: [NviCandidateGlobalStatusEnum.Pending],
      });
    });
  });
  describe("Dropdown status is 'Godkjent'", () => {
    it('returns approved as status and approved and pending as global status', () => {
      const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Approved]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Approved],
        newGlobalStatuses: [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending],
      });
    });
  });
  describe("Dropdown status is 'Avvist'", () => {
    it('returns rejected as status and rejected and pending as global status', () => {
      const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Rejected]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending],
      });
    });
  });
  describe("Dropdown status is 'Kandidater for kontroll' and 'Godkjent'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Approved,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved],
        newGlobalStatuses: [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Approved],
      });
    });
  });
  describe("Dropdown status is 'Kandidater for kontroll' and 'Avvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Rejected,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Rejected],
      });
    });
  });
  describe("Dropdown status is 'Godkjent' and 'Avvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Approved, NviSearchStatusEnum.Rejected]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Rejected,
        ],
      });
    });
  });
  describe("Dropdown status is 'Kandidater for kontroll', 'Godkjent' and 'Avvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Approved,
        NviSearchStatusEnum.Rejected,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Rejected,
        ],
      });
    });
  });
});

const tMock = (key: string, params: Record<string, any>) => {
  if (key === 'tasks.nvi.x_of_y_approved') {
    return `${params.approved} of ${params.total} approved`;
  }
  if (key === 'tasks.nvi.x_of_y_controlled') {
    return `${params.controlled} of ${params.total} controlled`;
  }
  return '';
};

describe('createPageSpecificAmountString', () => {
  it('returns approved string for NVI disputes page', () => {
    const approvals = [
      { approvalStatus: NviCandidateApprovalStatusEnum.Approved },
      { approvalStatus: NviCandidateApprovalStatusEnum.Rejected },
      { approvalStatus: NviCandidateApprovalStatusEnum.Approved },
      { approvalStatus: NviCandidateApprovalStatusEnum.Pending },
      { approvalStatus: NviCandidateApprovalStatusEnum.New },
    ] as NviCandidateSearchHitApproval[];
    const result = createPageSpecificAmountString(tMock as TFunction, UrlPathTemplate.TasksNviDisputes, approvals);
    expect(result).toBe('2 of 5 approved');
  });

  it('returns controlled string for NVI candidates page', () => {
    const approvals = [
      { approvalStatus: NviCandidateApprovalStatusEnum.Pending },
      { approvalStatus: NviCandidateApprovalStatusEnum.New },
      { approvalStatus: NviCandidateApprovalStatusEnum.Approved },
      { approvalStatus: NviCandidateApprovalStatusEnum.Rejected },
      { approvalStatus: NviCandidateApprovalStatusEnum.Rejected },
    ] as NviCandidateSearchHitApproval[];
    const result = createPageSpecificAmountString(tMock as TFunction, UrlPathTemplate.TasksNvi, approvals as any);
    expect(result).toBe('3 of 5 controlled');
  });

  it('returns empty string for other pages', () => {
    const approvals = [
      { approvalStatus: NviCandidateApprovalStatusEnum.Pending },
      { approvalStatus: NviCandidateApprovalStatusEnum.New },
      { approvalStatus: NviCandidateApprovalStatusEnum.Approved },
      { approvalStatus: NviCandidateApprovalStatusEnum.Rejected },
    ] as NviCandidateSearchHitApproval[];
    const result = createPageSpecificAmountString(tMock as TFunction, '/some/other/page', approvals as any);
    expect(result).toBe('');
  });

  it('handles empty approvals array', () => {
    const result = createPageSpecificAmountString(tMock as TFunction, UrlPathTemplate.TasksNvi, []);
    expect(result).toBe('');
  });
});
