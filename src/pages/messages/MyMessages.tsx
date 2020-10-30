import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '../../components/PageHeader';
import { RoleName } from '../../types/user.types';
import ListSkeleton from '../../components/ListSkeleton';
import Card from '../../components/Card';
import SubHeading from '../../components/SubHeading';
import useFetchRegistrationsWithPendingDoiRequest from '../../utils/hooks/useFetchRegistrationsWithPendingDoiRequest';
import { DoiRequestAccordion } from '../worklist/DoiRequestAccordion';

const MyMessages: FC = () => {
  const { t } = useTranslation('workLists');
  const [registrationsWithPendingDoiRequest, isLoadingPendingDoiRequests] = useFetchRegistrationsWithPendingDoiRequest(
    RoleName.CREATOR
  );

  return (
    <>
      <PageHeader>{t('my_messages')}</PageHeader>
      {isLoadingPendingDoiRequests ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : registrationsWithPendingDoiRequest.length === 0 ? (
        <Card>
          <SubHeading>{t('doi_requests.no_pending_doi_requests')}</SubHeading>
        </Card>
      ) : (
        <>
          {registrationsWithPendingDoiRequest.map((registration) => (
            <DoiRequestAccordion key={registration.identifier} registration={registration} />
          ))}
        </>
      )}
    </>
  );
};

export default MyMessages;
