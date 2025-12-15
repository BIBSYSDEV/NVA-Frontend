import { computeParamsFromDropdownStatus, computeDropdownStatusFromParams } from './nviUtils';
import { describe, expect, it } from 'vitest';
import { NviCandidateStatusEnum, NviCandidateGlobalStatusEnum } from '../../api/searchApi';
import { NviSearchStatusEnum } from '../../types/nvi.types';

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
    const res = computeParamsFromDropdownStatus([NviSearchStatusEnum.Rejected]);
    expect(res).toEqual({
      newStatuses: [NviCandidateStatusEnum.Rejected],
      newGlobalStatuses: [NviCandidateGlobalStatusEnum.Rejected, NviCandidateGlobalStatusEnum.Pending],
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
