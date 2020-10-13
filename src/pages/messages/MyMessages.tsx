import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PageHeader } from '../../components/PageHeader';
import { RoleName } from '../../types/user.types';
import ListSkeleton from '../../components/ListSkeleton';
import Card from '../../components/Card';
import SubHeading from '../../components/SubHeading';
import useFetchPublicationsWithPendingDoiRequest from '../../utils/hooks/useFetchPublicationsWithPendingDoiRequest';
import { DoiRequestAccordion } from '../worklist/DoiRequestAccordion';

const MyMessages: FC = () => {
  const { t } = useTranslation('workLists');
  const [publicationsWithPendingDoiRequest, isLoadingPendingDoiRequests] = useFetchPublicationsWithPendingDoiRequest(
    RoleName.CREATOR
  );

  return (
    <>
      <PageHeader>{t('my_messages')}</PageHeader>
      {isLoadingPendingDoiRequests ? (
        <ListSkeleton minWidth={100} maxWidth={100} height={100} />
      ) : publicationsWithPendingDoiRequest.length === 0 ? (
        <Card>
          <SubHeading>{t('doi_requests.no_pending_doi_requests')}</SubHeading>
        </Card>
      ) : (
        <>
          {publicationsWithPendingDoiRequest.map((publication) => (
            <DoiRequestAccordion key={publication.identifier} publication={publication} />
          ))}
        </>
      )}
    </>
  );
};

export default MyMessages;
