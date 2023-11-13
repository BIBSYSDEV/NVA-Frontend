import { SearchResponse } from '../types/common.types';
import { Keywords } from '../types/keywords.types';
import { Organization } from '../types/organization.types';
import { CristinProject, FundingSource, FundingSources } from '../types/project.types';
import {
  CreateCristinPerson,
  CristinPerson,
  Employment,
  FlatCristinPerson,
  PersonAggregations,
  PositionResponse,
} from '../types/user.types';
import { getIdentifierFromId } from '../utils/general-helpers';
import { CristinApiPath } from './apiPaths';
import { apiRequest2, authenticatedApiRequest, authenticatedApiRequest2 } from './apiRequest';

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
  const getFundingSources = await apiRequest2<FundingSources>({
    url: CristinApiPath.FundingSources,
  });
  return getFundingSources.data;
};

export const fetchFundingSource = async (fundingId: string) => {
  if (!fundingId) {
    return null;
  }

  const fundingIdentifier = getIdentifierFromId(fundingId);
  const url = `${CristinApiPath.FundingSources}/${fundingIdentifier}`;
  const getFundingSource = await apiRequest2<FundingSource>({ url });

  return getFundingSource.data;
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

export interface PersonSearchParams {
  name?: string;
  organization?: string;
  sector?: string;
}

export enum PersonSearchParameter {
  Name = 'name',
  Organization = 'organizationFacet',
  Page = 'page',
  Results = 'results',
  Sector = 'sectorFacet',
}

export const searchForPerson = async (
  results: number,
  page: number,
  { name, organization, sector }: PersonSearchParams
) => {
  const searchParams = new URLSearchParams();
  if (results) {
    searchParams.set(PersonSearchParameter.Results, results.toString());
  }
  if (page) {
    searchParams.set(PersonSearchParameter.Page, page.toString());
  }
  if (name) {
    searchParams.set(PersonSearchParameter.Name, name);
  }
  if (organization) {
    searchParams.set(PersonSearchParameter.Organization, organization);
  }
  if (sector) {
    searchParams.set(PersonSearchParameter.Sector, sector);
  }

  const queryContent = searchParams.toString();
  const queryParams = queryContent ? `?${queryContent}` : '';

  const fetchPersonResponse = await apiRequest2<SearchResponse<CristinPerson, PersonAggregations>>({
    headers: { Accept: 'application/json; version=2023-11-03' },
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

export const uploadProfilePicture = async (cristinId: string, base64String: string) =>
  await authenticatedApiRequest2<{ base64Data: string }>({
    url: `${cristinId}/picture`,
    method: 'PUT',
    data: { base64Data: base64String },
  });

export const fetchProfilePicture = async (cristinId: string) => {
  const fetchProfilePictureResponse = await apiRequest2<{ base64Data: string }>({
    url: `${cristinId}/picture`,
  });
  return fetchProfilePictureResponse.data;
};

export const searchForKeywords = async (results: number, page: number, query?: string) => {
  const searchParams = new URLSearchParams();
  if (query) {
    searchParams.set('query', query);
  }
  searchParams.set('results', results.toString());
  searchParams.set('page', page.toString());

  const queryContent = searchParams.toString();
  const queryParams = queryContent ? `?${queryContent}` : '';

  const fetchKeywordsResponse = await apiRequest2<SearchResponse<Keywords>>({
    url: `${CristinApiPath.Keyword}${queryParams}`,
  });

  return fetchKeywordsResponse.data;
};
