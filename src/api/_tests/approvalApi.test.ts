import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { ApprovalSearchResponse } from '../../types/approval.types';
import { ApprovalApiPath } from '../apiPaths';
import { apiRequest2 } from '../apiRequest';
import { searchApprovalsByIdentifier, searchApprovalsByQuery } from '../approvalApi';

vi.mock('../apiRequest', () => ({
  apiRequest2: vi.fn(),
}));

const searchResponse: ApprovalSearchResponse = { totalHits: 0, hits: [] };

const requestConfig = (): AxiosRequestConfig => vi.mocked(apiRequest2).mock.calls[0][0];

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(apiRequest2).mockResolvedValue({ data: searchResponse } as AxiosResponse<ApprovalSearchResponse>);
});

describe('searchApprovalsByQuery()', () => {
  test('Sends the search term as the query parameter', async () => {
    await searchApprovalsByQuery('brain');

    expect(requestConfig().url).toBe(ApprovalApiPath.Approval);
    expect(requestConfig().params).toEqual({ query: 'brain' });
  });

  test('Returns the search response', async () => {
    expect(await searchApprovalsByQuery('brain')).toEqual(searchResponse);
  });
});

describe('searchApprovalsByIdentifier()', () => {
  test('Sends the identifier name and value separated by a colon as the identifier parameter', async () => {
    await searchApprovalsByIdentifier({ name: 'REK', value: '123456' });

    expect(requestConfig().url).toBe(ApprovalApiPath.Approval);
    expect(requestConfig().params).toEqual({ identifier: 'REK:123456' });
  });
});
