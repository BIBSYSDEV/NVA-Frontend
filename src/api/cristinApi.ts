import { SearchResponse } from '../types/common.types';
import { Organization } from '../types/organization.types';
import { CristinProject, FundingSources } from '../types/project.types';
import {
  CreateCristinPerson,
  CristinPerson,
  FlatCristinPerson,
  Employment,
  PositionResponse,
} from '../types/user.types';
import { CristinApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest } from './apiRequest';

export const createCristinPerson = async (cristinPerson: CreateCristinPerson) =>
  await authenticatedApiRequest<CristinPerson>({
    url: CristinApiPath.Person,
    method: 'POST',
    data: cristinPerson,
  });

export const updateCristinPerson = async (id: string, cristinPerson: Partial<FlatCristinPerson>) =>
  await authenticatedApiRequest({
    url: id,
    method: 'PATCH',
    data: cristinPerson,
  });

type EmploymentData = Omit<Employment, 'endDate' | 'fullTimeEquivalentPercentage'> &
  Partial<Pick<Employment, 'endDate' | 'fullTimeEquivalentPercentage'>>;

export const addEmployment = async (userId: string, employment: EmploymentData) =>
  await authenticatedApiRequest<Employment>({
    url: `${userId}/employment`,
    method: 'POST',
    data: employment,
  });

interface NationalNumberSearchData {
  type: 'NationalIdentificationNumber';
  value: string;
}

export const searchByNationalIdNumber = async (nationalIdNumber: string) => {
  const data: NationalNumberSearchData = {
    type: 'NationalIdentificationNumber',
    value: nationalIdNumber,
  };
  return await authenticatedApiRequest<CristinPerson>({
    url: CristinApiPath.PersonIdentityNumber,
    method: 'POST',
    data: data,
  });
};

export const fetchFundingSources = async () => {
  const getTickets = await apiRequest2<FundingSources>({
    url: CristinApiPath.FundingSources,
  });
  return getTickets.data;
};

export const fetchOrganization = async (id: string) => {
  const fetchOrganizationResponse = await apiRequest2<Organization>({
    url: id,
  });
  return fetchOrganizationResponse.data;
};

export const fetchPositions = async (includeDisabledPositions: boolean) => {
  const fetchPositionsResponse = await apiRequest2<PositionResponse>({
    url: includeDisabledPositions ? CristinApiPath.Position : `${CristinApiPath.Position}?active=true`,
  });
  return fetchPositionsResponse.data;
};

export const fetchPerson = async (personId: string) => {
  const fetchPersonResponse = await apiRequest2<CristinPerson>({
    url: personId,
  });
  return fetchPersonResponse.data;
};

export const searchForPerson = async (results: number, page: number, name: string) => {
  const searchParams = new URLSearchParams();
  if (name) {
    searchParams.set('name', name);
  }
  if (results) {
    searchParams.set('results', results.toString());
  }
  if (page) {
    searchParams.set('page', page.toString());
  }

  const queryContent = searchParams.toString();
  const queryParams = queryContent ? `?${queryContent}` : '';

  const fetchPersonResponse = await apiRequest2<SearchResponse<CristinPerson>>({
    url: `${CristinApiPath.Person}${queryParams}`,
  });
  return fetchPersonResponse.data;
};

interface ProjectsSearchParams {
  query?: string;
  creator?: string;
  participant?: string;
}

export const searchForProjects = async (results: number, page: number, params?: ProjectsSearchParams) => {
  const searchParams = new URLSearchParams();
  if (params?.query) {
    searchParams.set('query', params.query);
  }
  searchParams.set('results', results.toString());
  searchParams.set('page', page.toString());
  if (params?.creator) {
    searchParams.set('creator', params.creator);
  }
  if (params?.participant) {
    searchParams.set('participant', params.participant);
  }

  const queryContent = searchParams.toString();
  const queryParams = queryContent ? `?${queryContent}` : '';

  const fetchProjectsResponse = await apiRequest2<SearchResponse<CristinProject>>({
    url: `${CristinApiPath.Project}${queryParams}`,
  });
  return fetchProjectsResponse.data;
};

export const fetchProject = async (projectId: string) => {
  const fetchProjectRespone = await apiRequest2<CristinProject>({
    url: projectId,
  });
  return fetchProjectRespone.data;
};
