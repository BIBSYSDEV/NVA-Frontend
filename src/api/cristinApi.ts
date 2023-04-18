import { FundingSources } from '../types/project.types';
import { CreateCristinPerson, CristinPerson, FlatCristinPerson, Employment } from '../types/user.types';
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
