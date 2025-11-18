import {
  updateParamsFromStatusAndFilterValues,
  getVisibilityFilterValue,
  computeParamsFromDropdownStatus,
  computeDropdownStatusFromParams,
} from './nviUtils';
import { describe, expect, it } from 'vitest';
import { NviCandidateStatusEnum, NviCandidateGlobalStatusEnum, NviCandidateFilter } from '../../api/searchApi';
import { NviSearchStatusEnum } from '../../types/nvi.types';

describe('computeDropdownStatusFromParams', () => {
  describe("status: pending and globalStatus: pending'", () => {
    it('returns the state candidates for control', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending],
        [NviCandidateGlobalStatusEnum.Pending]
      );
      expect(res).toEqual([NviSearchStatusEnum.CandidatesForControl]);
    });
  });
  describe('status: approved and globalStatus: approved and pending', () => {
    it('returns the state approved', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Approved],
        [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending]
      );
      expect(res).toEqual([NviSearchStatusEnum.Approved]);
    });
  });
  describe('status: rejected and globalStatus: rejected and pending', () => {
    it('returns the state rejected', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Rejected],
        [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending]
      );
      expect(res).toEqual([NviSearchStatusEnum.Rejected]);
    });
  });
  describe('globalStatus: dispute', () => {
    it('returns the state dispute', () => {
      const res = computeDropdownStatusFromParams(null, [NviCandidateGlobalStatusEnum.Dispute]);
      expect(res).toEqual([NviSearchStatusEnum.Dispute]);
    });
  });
  describe('status:pending and approved and globalStatus: pending and approved', () => {
    it('returns the states candidates for control and approved', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved],
        [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Approved]
      );
      expect(res).toEqual([NviSearchStatusEnum.CandidatesForControl, NviSearchStatusEnum.Approved]);
    });
  });
  describe('status: pending, rejected and globalStatus: pending, rejected', () => {
    it('returns the states candidates for control and rejected', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Rejected],
        [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Rejected]
      );
      expect(res).toEqual([NviSearchStatusEnum.CandidatesForControl, NviSearchStatusEnum.Rejected]);
    });
  });
  describe('status: pending and globalStatus: pending, dispute', () => {
    it('returns the states candidates for control and dispute', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending],
        [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Dispute]
      );
      expect(res).toEqual([NviSearchStatusEnum.CandidatesForControl, NviSearchStatusEnum.Dispute]);
    });
  });
  describe('status: approved, rejected and globalStatus: approved, pending, rejected', () => {
    it('returns the states approved and rejected', () => {
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
  describe('status: approved and globalStatus: approved, pending and dispute', () => {
    it('returns the states approved and dispute', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Approved],
        [
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Dispute,
        ]
      );
      expect(res).toEqual([NviSearchStatusEnum.Approved, NviSearchStatusEnum.Dispute]);
    });
  });
  describe('globalStatus: dispute, rejected, pending and status: rejected', () => {
    it('returns the correct states', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Rejected],
        [
          NviCandidateGlobalStatusEnum.Dispute,
          NviCandidateGlobalStatusEnum.Rejected,
          NviCandidateGlobalStatusEnum.Pending,
        ]
      );
      expect(res).toEqual([NviSearchStatusEnum.Rejected, NviSearchStatusEnum.Dispute]);
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
  describe('status: pending, approved and globalStatus: pending, approved, dispute', () => {
    it('returns the correct states', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved],
        [
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Dispute,
        ]
      );
      expect(res).toEqual([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Approved,
        NviSearchStatusEnum.Dispute,
      ]);
    });
  });
  describe('status: pending, rejected and globalStatus: pending, dispute, rejected', () => {
    it('returns the correct states', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Rejected],
        [
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Dispute,
          NviCandidateGlobalStatusEnum.Rejected,
        ]
      );
      expect(res).toEqual([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Rejected,
        NviSearchStatusEnum.Dispute,
      ]);
    });
  });
  describe('status: rejected, approved and globalStatus: rejected, pending, dispute, approved', () => {
    it('returns the correct status state', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Rejected, NviCandidateStatusEnum.Approved],
        [
          NviCandidateGlobalStatusEnum.Rejected,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Dispute,
          NviCandidateGlobalStatusEnum.Approved,
        ]
      );
      expect(res).toEqual([NviSearchStatusEnum.Approved, NviSearchStatusEnum.Rejected, NviSearchStatusEnum.Dispute]);
    });
  });
  describe('status: approved, rejected, pending and globalStatus: approved, pending, rejected, dispute', () => {
    it('returns the correct status state', () => {
      const res = computeDropdownStatusFromParams(
        [NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected, NviCandidateStatusEnum.Pending],
        [
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Rejected,
          NviCandidateGlobalStatusEnum.Dispute,
        ]
      );
      expect(res).toEqual([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Approved,
        NviSearchStatusEnum.Rejected,
        NviSearchStatusEnum.Dispute,
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
    const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Rejected]);
    expect(res).toEqual({
      newStatuses: [NviCandidateStatusEnum.Rejected],
      newGlobalStatuses: [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending],
    });
  });
  describe("Dropdown status is 'Tvist'", () => {
    it('returns dispute as global status and no status', () => {
      const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Dispute]);
      expect(res).toEqual({
        newStatuses: [],
        newGlobalStatuses: [NviCandidateGlobalStatusEnum.Dispute],
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
  describe("Dropdown status is 'Kandidater for kontroll' and 'Tvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Dispute,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending],
        newGlobalStatuses: [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Dispute],
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
  describe("Dropdown status is 'Godkjent' and 'Tvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Approved, NviSearchStatusEnum.Dispute]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Approved],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Dispute,
        ],
      });
    });
  });
  describe("Dropdown status is 'Avvist' and 'Tvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Rejected, NviSearchStatusEnum.Dispute]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Rejected,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Dispute,
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
  describe("Dropdown status is 'Godkjent', 'Avvist' and 'Tvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.Approved,
        NviSearchStatusEnum.Rejected,
        NviSearchStatusEnum.Dispute,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Rejected,
          NviCandidateGlobalStatusEnum.Dispute,
        ],
      });
    });
  });
  describe("Dropdown status is 'Kandidater for kontroll', 'Avvist' and 'Tvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Rejected,
        NviSearchStatusEnum.Dispute,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Rejected,
          NviCandidateGlobalStatusEnum.Dispute,
        ],
      });
    });
  });
  describe("Dropdown status is 'Kandidater for kontroll', 'Godkjent' and 'Tvist'", () => {
    it('returns the correct statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Approved,
        NviSearchStatusEnum.Dispute,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Dispute,
        ],
      });
    });
  });
  describe('Dropdown status are all statuses', () => {
    it('returns all statuses and global statuses', () => {
      const res = computeParamsFromDropdownStatus([
        NviSearchStatusEnum.CandidatesForControl,
        NviSearchStatusEnum.Approved,
        NviSearchStatusEnum.Rejected,
        NviSearchStatusEnum.Dispute,
      ]);
      expect(res).toEqual({
        newStatuses: [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected],
        newGlobalStatuses: [
          NviCandidateGlobalStatusEnum.Pending,
          NviCandidateGlobalStatusEnum.Approved,
          NviCandidateGlobalStatusEnum.Rejected,
          NviCandidateGlobalStatusEnum.Dispute,
        ],
      });
    });
  });
});

describe('getVisibilityFilterValue', () => {
  describe("UI status dropdown shows 'Kandidater til kontroll'", () => {
    const status = [NviCandidateStatusEnum.Pending];
    const globalStatus = [NviCandidateGlobalStatusEnum.Pending];

    it('and no filter is selected', () => {
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("and 'Vis kun sampublikasjoner' is chosen as filter", () => {
      const result = getVisibilityFilterValue(status, globalStatus, 'collaboration');
      expect(result).toBe('collaboration');
    });
  });

  describe("UI status dropdown shows 'Godkjent'", () => {
    const status = [NviCandidateStatusEnum.Approved];

    it('and no filter is selected', () => {
      const result = getVisibilityFilterValue(
        status,
        [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending],
        null
      );
      expect(result).toBe('');
    });

    it("and 'Kandidater andre må kontrollere' is chosen as filter", () => {
      const result = getVisibilityFilterValue(status, [NviCandidateGlobalStatusEnum.Pending], null);
      expect(result).toBe('pending');
    });

    it("and 'Kandidater alle har godkjent' is chosen as filter", () => {
      const result = getVisibilityFilterValue(status, [NviCandidateGlobalStatusEnum.Approved], null);
      expect(result).toBe('approved');
    });
  });

  describe("UI status dropdown shows 'Rejected'", () => {
    const status = [NviCandidateStatusEnum.Approved];

    it('and no filter is selected', () => {
      const result = getVisibilityFilterValue(
        status,
        [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending],
        null
      );
      expect(result).toBe('');
    });

    it("and 'Kandidater andre må kontrollere' is chosen as filter", () => {
      const result = getVisibilityFilterValue(status, [NviCandidateGlobalStatusEnum.Pending], null);
      expect(result).toBe('pending');
    });

    it("and 'Kandidater alle har avvist' is chosen as filter", () => {
      const result = getVisibilityFilterValue(status, [NviCandidateGlobalStatusEnum.Rejected], null);
      expect(result).toBe('rejected');
    });
  });

  describe("UI status dropdown shows 'Tvist'", () => {
    const globalStatus = [NviCandidateGlobalStatusEnum.Dispute];

    it('and no filter is selected', () => {
      const result = getVisibilityFilterValue(null, globalStatus, null);
      expect(result).toBe('');
    });

    it("and 'Kandidater andre har godkjent' is chosen as filter", () => {
      const result = getVisibilityFilterValue(null, globalStatus, 'approvedByOthers' as NviCandidateFilter);
      expect(result).toBe('approvedByOthers');
    });

    it("and 'Kandidater andre har avvist' is chosen as filter", () => {
      const result = getVisibilityFilterValue(null, globalStatus, 'rejectedByOthers' as NviCandidateFilter);
      expect(result).toBe('rejectedByOthers');
    });
  });

  describe('When UI status has selected multiple values', () => {
    it("returns '' when 'Tvist' and 'Avvist' are selected", () => {
      const status = [NviCandidateStatusEnum.Rejected];
      const globalStatus = [
        NviCandidateGlobalStatusEnum.Dispute,
        NviCandidateGlobalStatusEnum.Rejected,
        NviCandidateGlobalStatusEnum.Pending,
      ];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Tvist' and 'Godkjent' are selected", () => {
      const status = [NviCandidateStatusEnum.Approved];
      const globalStatus = [
        NviCandidateGlobalStatusEnum.Approved,
        NviCandidateGlobalStatusEnum.Pending,
        NviCandidateGlobalStatusEnum.Dispute,
      ];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Tvist' and 'Kandidater til kontroll' are selected", () => {
      const status = [NviCandidateStatusEnum.Pending];
      const globalStatus = [NviCandidateGlobalStatusEnum.Dispute, NviCandidateGlobalStatusEnum.Pending];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Tvist', 'Avvist' and 'Godkjent' are selected", () => {
      const status = [NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected];
      const globalStatus = [
        NviCandidateGlobalStatusEnum.Approved,
        NviCandidateGlobalStatusEnum.Pending,
        NviCandidateGlobalStatusEnum.Rejected,
        NviCandidateGlobalStatusEnum.Dispute,
      ];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Tvist', 'Avvist', 'Godkjent' and 'Kandidater til kontroll' are selected", () => {
      const status = [NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected, NviCandidateStatusEnum.Pending];
      const globalStatus = [
        NviCandidateGlobalStatusEnum.Approved,
        NviCandidateGlobalStatusEnum.Pending,
        NviCandidateGlobalStatusEnum.Rejected,
        NviCandidateGlobalStatusEnum.Dispute,
      ];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Avvist' and 'Godkjent' are selected", () => {
      const status = [NviCandidateStatusEnum.Approved, NviCandidateStatusEnum.Rejected];
      const globalStatus = [
        NviCandidateGlobalStatusEnum.Approved,
        NviCandidateGlobalStatusEnum.Pending,
        NviCandidateGlobalStatusEnum.Rejected,
      ];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Avvist' and 'Kandidater til kontroll' are selected", () => {
      const status = [NviCandidateStatusEnum.Rejected, NviCandidateStatusEnum.Pending];
      const globalStatus = [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Avvist', 'Godkjent' and 'Kandidater til kontroll' are selected", () => {
      const status = [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Rejected, NviCandidateStatusEnum.Approved];
      const globalStatus = [
        NviCandidateGlobalStatusEnum.Pending,
        NviCandidateGlobalStatusEnum.Rejected,
        NviCandidateGlobalStatusEnum.Approved,
      ];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });

    it("returns '' when 'Godkjent' and 'Kandidater til kontroll' are selected", () => {
      const status = [NviCandidateStatusEnum.Pending, NviCandidateStatusEnum.Approved];
      const globalStatus = [NviCandidateGlobalStatusEnum.Pending, NviCandidateGlobalStatusEnum.Approved];
      const result = getVisibilityFilterValue(status, globalStatus, null);
      expect(result).toBe('');
    });
  });

  describe("returns '' when no case matches", () => {
    it('- only empty inputs', () => {
      const result = getVisibilityFilterValue(null, null, null);
      expect(result).toBe('');
    });
  });
});

describe('updateParamsFromStatusAndFilterValues', () => {
  describe("UI status dropdown shows 'Kandidater til kontroll'", () => {
    const paramsObj = new URLSearchParams();
    it("'Vis kun sampublikasjoner' has been selected'", () => {
      const newParams = updateParamsFromStatusAndFilterValues(
        paramsObj,
        [NviCandidateStatusEnum.Pending],
        [NviCandidateGlobalStatusEnum.Pending],
        'collaboration'
      );
      expect(newParams.toString()).toBe('filter=collaboration');
    });
  });
  describe("UI status dropdown shows 'Godkjent'", () => {
    const paramsObj = new URLSearchParams();
    it("'Kandidater andre må kontrollere' has been selected'", () => {
      const newParams = updateParamsFromStatusAndFilterValues(
        paramsObj,
        [NviCandidateStatusEnum.Approved],
        [NviCandidateGlobalStatusEnum.Approved, NviCandidateGlobalStatusEnum.Pending],
        'pending'
      );
      expect(newParams.toString()).toBe('globalStatus=pending');
    });
    it("'Kandidater alle har godkjent' has been selected'", () => {
      const newParams = updateParamsFromStatusAndFilterValues(
        paramsObj,
        [NviCandidateStatusEnum.Approved],
        [NviCandidateGlobalStatusEnum.Pending],
        'approved'
      );
      expect(newParams.toString()).toBe('globalStatus=approved');
    });
  });
  describe("UI status dropdown shows 'Avvist'", () => {
    const paramsObj = new URLSearchParams();
    it("'Kandidater andre må kontrollere' has been selected'", () => {
      const newParams = updateParamsFromStatusAndFilterValues(
        paramsObj,
        [NviCandidateStatusEnum.Rejected],
        [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending],
        'pending'
      );
      expect(newParams.toString()).toBe('globalStatus=pending');
    });
    it("'Kandidater alle har godkjent' has been selected'", () => {
      const newParams = updateParamsFromStatusAndFilterValues(
        paramsObj,
        [NviCandidateStatusEnum.Rejected],
        [NviCandidateGlobalStatusEnum.Pending],
        'rejected'
      );
      expect(newParams.toString()).toBe('globalStatus=rejected');
    });
  });
  describe("UI status dropdown shows 'Tvist'", () => {
    const paramsObj = new URLSearchParams();
    it("'Kandidater andre mhar godkjent' has been selected'", () => {
      const newParams = updateParamsFromStatusAndFilterValues(
        paramsObj,
        [],
        [NviCandidateGlobalStatusEnum.Dispute],
        'approvedByOthers'
      );
      expect(newParams.toString()).toBe('filter=approvedByOthers');
    });
    it("'Kandidater andre har avvist' has been selected'", () => {
      const newParams = updateParamsFromStatusAndFilterValues(
        paramsObj,
        [],
        [NviCandidateGlobalStatusEnum.Dispute],
        'rejectedByOthers'
      );
      expect(newParams.toString()).toBe('filter=rejectedByOthers');
    });
  });
});
