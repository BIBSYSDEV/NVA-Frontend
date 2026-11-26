import { DefaultOptions } from '@tanstack/react-query';

/**
 * Query behaviour every test wants: a failing request should fail once and be done with it
 */
export const testQueryOptions: DefaultOptions = { queries: { retry: false } };
