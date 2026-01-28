import { useFetchCustomers } from './useFetchCustomers';

export const useFetchCustomerMap = () => {
  const customersQuery = useFetchCustomers();
  const customers = customersQuery.data?.customers ?? [];
  return new Map(customers.map((customer) => [customer.cristinId, customer]));
};
