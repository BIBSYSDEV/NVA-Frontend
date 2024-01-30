import { Registration } from './registration.types';

interface Problem {
  title: string;
  status: number;
  requestId: string;
}

export interface DeletedRegistrationProblem extends Problem {
  resource: Registration | undefined;
}
