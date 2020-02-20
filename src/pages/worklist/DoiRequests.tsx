import React, { FC, useState, useEffect } from 'react';
import { getDoiRequests } from '../../api/publicationApi';
import Card from '../../components/Card';
import WorklistTable from './WorkListTable';

const DoiRequests: FC = () => {
  const [doiRequests, setDoiRequests] = useState([]);

  useEffect(() => {
    const fetchDoiRequests = async () => {
      const doiRequestsResponse = await getDoiRequests();
      if (!doiRequestsResponse.error) {
        setDoiRequests(doiRequestsResponse);
      }
    };
    fetchDoiRequests();
  }, []);

  return (
    <Card>
      <WorklistTable publications={doiRequests} />
    </Card>
  );
};

export default DoiRequests;
