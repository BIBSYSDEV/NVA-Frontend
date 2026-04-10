import { AxiosRequestConfig } from 'axios';
import { apiRequest2, authenticatedApiRequest2 } from './apiRequest';
import { API_URL } from '../utils/constants';

const BASE_URL = `${API_URL}scientific-index`;

export type ReportFormat =
  | 'application/json'
  | 'text/csv; charset=utf-8'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export enum ReportProfile {
  AuthorShares = 'https://api.nva.unit.no/report/author-shares',
  PublicationPoints = 'https://api.nva.unit.no/report/publication-points',
}

export interface ReportRequestOptions {
  year: number;
  institutionId?: string; // undefined => all institutions
  format: ReportFormat;
  profile?: ReportProfile;
}

export interface ReportInitResponse {
  id: string;
  uri: string;
}

export interface PollOptions {
  initialDelayMs?: number;
  maxDelayMs?: number;
  maxTimeMs?: number;
  signal?: AbortSignal;
}

const buildAcceptHeader = (options: ReportRequestOptions): string => {
  const { format, profile } = options;

  if (format === 'application/json') {
    return format;
  }

  if (!profile) {
    return format;
  }

  return `${format}; profile=${profile}`;
};

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
  new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    };

    const id = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);

    if (signal) {
      signal.addEventListener('abort', onAbort);
    }
  });

export const fetchReport = async (options: ReportRequestOptions, signal?: AbortSignal): Promise<ReportInitResponse> => {
  const { year, institutionId } = options;
  const path =
    institutionId != null
      ? `/reports/${year}/institutions/${encodeURIComponent(institutionId)}`
      : `/reports/${year}/institutions`;

  const url = `${BASE_URL}${path}`;
  const acceptHeader = buildAcceptHeader(options);

  const requestConfig: AxiosRequestConfig = {
    url,
    method: 'GET',
    headers: {
      Accept: acceptHeader,
    },
    signal,
  };

  const reportResponse = await authenticatedApiRequest2<ReportInitResponse>(requestConfig);

  // NOTE: Axios throws for non-2xx codes (unless you configured it otherwise), so if we are here, it's OK.
  if (!reportResponse.data?.uri) {
    throw new Error('Kunne ikke hente rapport');
  }

  return reportResponse.data;
};

export const pollForReportReady = async (presignedUrl: string, options: PollOptions = {}): Promise<Blob> => {
  const initialDelayMs = options.initialDelayMs ?? 1000;
  const maxDelayMs = options.maxDelayMs ?? 16000;
  const maxTimeMs = options.maxTimeMs ?? 60000;
  const signal = options.signal;

  let delay = initialDelayMs;
  const startTime = Date.now();

  while (true) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const elapsed = Date.now() - startTime;
    if (elapsed > maxTimeMs) {
      throw new Error('Kunne ikke hente rapport. Det tok rett og slett for lang tid...');
    }

    try {
      const requestConfig: AxiosRequestConfig = {
        url: presignedUrl,
        method: 'GET',
        responseType: 'blob',
        signal,
      };

      const reportResponse = await apiRequest2<Blob>(requestConfig);

      return reportResponse.data;
    } catch (err: any) {
      if (signal?.aborted) {
        throw new DOMException('Aborted', 'AbortError');
      }

      const status = err?.response?.status as number | undefined;

      // While the report is being generated, the presigned URL returns 404
      if (status === 404) {
        await sleep(delay, signal);
        delay = Math.min(delay * 2, maxDelayMs);
        continue;
        console.log('polling...');
      }

      const message = err?.response?.data || err?.message || 'Kunne ikke generere rapport.';
      throw new Error(`Kunne ikke generere rapport (status ${status ?? 'unknown'}): ${message}`);
    }
  }
};

export interface DownloadReportOptions extends ReportRequestOptions, PollOptions {}

export const generateReportFile = async (options: DownloadReportOptions): Promise<Blob> => {
  const controller = new AbortController();
  const innerSignal = controller.signal;

  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort(), {
      once: true,
    });
  }

  const init = await fetchReport(options, innerSignal);
  const blob = await pollForReportReady(init.uri, {
    initialDelayMs: options.initialDelayMs,
    maxDelayMs: options.maxDelayMs,
    maxTimeMs: options.maxTimeMs,
    signal: innerSignal,
  });

  return blob;
};
