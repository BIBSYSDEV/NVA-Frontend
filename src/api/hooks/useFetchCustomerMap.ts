import { useMemo } from 'react';
import { useFetchCustomers } from './useFetchCustomers';

export const useFetchCustomerMap = () => {
  const customersQuery = useFetchCustomers();
  const customers = useMemo(() => customersQuery.data?.customers ?? [], [customersQuery.data?.customers]);

  return {
    nvaCustomers: useMemo(() => new Map(customers.map((customer) => [customer.cristinId, customer])), [customers]),
    isFetchingCustomerMap: customersQuery.isLoading,
  };
};
