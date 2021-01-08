import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/Card';
import ListSkeleton from '../../components/ListSkeleton';
import SubHeading from '../../components/SubHeading';
import { RoleName } from '../../types/user.types';
import useFetchRegistrationsWithPendingDoiRequest from '../../utils/hooks/useFetchRegistrationsWithPendingDoiRequest';
import { DoiRequestAccordion } from './DoiRequestAccordion';

const DoiRequests = () => {
  const { t } = useTranslation('workLists');
  const [registrationsWithPendingDoiRequest, isLoadingPendingDoiRequests] = useFetchRegistrationsWithPendingDoiRequest(
    RoleName.CURATOR
  );

  return isLoadingPendingDoiRequests ? (
    <ListSkeleton minWidth={100} maxWidth={100} height={100} />
  ) : registrationsWithPendingDoiRequest.length === 0 ? (
    <Card>
      <SubHeading>{t('doi_requests.no_pending_doi_requests')}</SubHeading>
    </Card>
  ) : (
    <>
      {registrationsWithPendingDoiRequest.map((registration) => (
        <DoiRequestAccordion key={registration.identifier} identifier={registration.identifier} />
      ))}
    </>
  );
};

export default DoiRequests;
