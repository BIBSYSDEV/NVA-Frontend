import { AxiosHeaders } from 'axios';
import { SearchResponse } from '../types/common.types';
import { Keywords } from '../types/keywords.types';
import { Organization } from '../types/organization.types';
import { CristinProject, FundingSource, FundingSources, ProjectAggregations } from '../types/project.types';
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

export interface OrganizationSearchParams {
  query?: string;
  page?: number;
  results?: number;
  includeSubunits?: boolean;
}

export const searchForOrganizations = async (params: OrganizationSearchParams) => {
  const searchParams = new URLSearchParams();
  const headers = new AxiosHeaders();

  if (params.query) {
    searchParams.set('query', params.query);
  }
  if (params.includeSubunits) {
    headers.set('Accept', 'application/json; version=1');
  }

  searchParams.set('results', params.results?.toString() ?? '20');
  searchParams.set('page', params.page?.toString() ?? '1');

  const queryContent = searchParams.toString();
  const queryParams = queryContent ? `?${queryContent}` : '';

  const fetchOrganizationsResponse = await apiRequest2<SearchResponse<Organization>>({
    headers,
    url: `${CristinApiPath.Organization}${queryParams}`,
  });

  return fetchOrganizationsResponse.data;
};

export const fetchOrganization = async (id: string) => {
  const fetchOrganizationResponse = await apiRequest2<Organization>({
    url: id,
  });
  return fetchOrganizationResponse.data;
};

export const fetchOrganizations = async (ids: string[]) => {
  const areaPromises = ids.map(async (id) => {
    return await fetchOrganization(id);
  });
  return await Promise.all(areaPromises);
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
  name?: string | null;
  orderBy?: string | null;
  organization?: string | null;
  sector?: string | null;
  sort?: string | null;
}

export enum PersonSearchParameter {
  Name = 'name',
  OrderBy = 'orderBy',
  Organization = 'organizationFacet',
  Page = 'page',
  Results = 'results',
  Sector = 'sectorFacet',
  Sort = 'sort',
}

export const searchForPerson = async (
  results: number,
  page: number,
  { name, orderBy, organization, sector, sort }: PersonSearchParams
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

  if (orderBy === 'name' && sort === 'desc') {
    searchParams.set(PersonSearchParameter.Sort, 'name desc');
  } else {
    searchParams.set(PersonSearchParameter.Sort, 'name');
  }

  const queryContent = searchParams.toString();
  const queryParams = queryContent ? `?${queryContent}` : '';

  const fetchPersonResponse = await apiRequest2<SearchResponse<CristinPerson, PersonAggregations>>({
    headers: { Accept: 'application/json; version=2023-11-03' },
    url: `${CristinApiPath.Person}${queryParams}`,
  });
  return fetchPersonResponse.data;
};

export interface ProjectsSearchParams {
  categoryFacet?: string | null;
  coordinatingFacet?: string | null;
  creator?: string | null;
  fundingSourceFacet?: string | null;
  healthProjectFacet?: string | null;
  orderBy?: string | null;
  participant?: string | null;
  participantFacet?: string | null;
  participantOrgFacet?: string | null;
  responsibleFacet?: string | null;
  sectorFacet?: string | null;
  sort?: string | null;
  status?: string | null;
  query?: string | null;
}

export enum ProjectSearchParameter {
  CategoryFacet = 'categoryFacet',
  CoordinatingFacet = 'coordinatingFacet',
  Creator = 'creator',
  FundingSourceFacet = 'fundingSourceFacet',
  HealthProjectFacet = 'healthProjectFacet',
  OrderBy = 'orderBy',
  Page = 'page',
  Participant = 'participant',
  ParticipantFacet = 'participantFacet',
  ParticipantOrgFacet = 'participantOrgFacet',
  ResponsibleFacet = 'responsibleFacet',
  Results = 'results',
  SectorFacet = 'sectorFacet',
  Sort = 'sort',
  Status = 'status',
  Query = 'multiple',
}

export const searchForProjects = async (results: number, page: number, params?: ProjectsSearchParams) => {
  const searchParams = new URLSearchParams();
  if (results) {
    searchParams.set(ProjectSearchParameter.Results, results.toString());
  }
  if (page) {
    searchParams.set(ProjectSearchParameter.Page, page.toString());
  }
  if (params?.categoryFacet) {
    searchParams.set(ProjectSearchParameter.CategoryFacet, params.categoryFacet);
  }
  if (params?.coordinatingFacet) {
    searchParams.set(ProjectSearchParameter.CoordinatingFacet, params.coordinatingFacet);
  }
  if (params?.creator) {
    searchParams.set(ProjectSearchParameter.Creator, params.creator);
  }
  if (params?.fundingSourceFacet) {
    searchParams.set(ProjectSearchParameter.FundingSourceFacet, params.fundingSourceFacet);
  }
  if (params?.status) {
    searchParams.set(ProjectSearchParameter.Status, params.status);
  }
  if (params?.healthProjectFacet) {
    searchParams.set(ProjectSearchParameter.HealthProjectFacet, params.healthProjectFacet);
  }
  if (params?.participant) {
    searchParams.set(ProjectSearchParameter.Participant, params.participant);
  }
  if (params?.participantFacet) {
    searchParams.set(ProjectSearchParameter.ParticipantFacet, params.participantFacet);
  }
  if (params?.participantOrgFacet) {
    searchParams.set(ProjectSearchParameter.ParticipantOrgFacet, params.participantOrgFacet);
  }
  if (params?.responsibleFacet) {
    searchParams.set(ProjectSearchParameter.ResponsibleFacet, params.responsibleFacet);
  }
  if (params?.sectorFacet) {
    searchParams.set(ProjectSearchParameter.SectorFacet, params.sectorFacet);
  }
  if (params?.orderBy === 'name' && params?.sort === 'desc') {
    searchParams.set(ProjectSearchParameter.Sort, 'name desc');
  } else {
    searchParams.set(ProjectSearchParameter.Sort, 'name');
  }
  if (params?.query) {
    searchParams.set(ProjectSearchParameter.Query, params.query);
  }

  const queryContent = searchParams.toString();
  const queryParams = queryContent ? `?${queryContent}` : '';

  const fetchProjectsResponse = await apiRequest2<SearchResponse<CristinProject, ProjectAggregations>>({
    headers: { Accept: 'application/json; version=2023-11-03' },
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
