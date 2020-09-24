import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import SubHeading from '../../components/SubHeading';
import useFetchDoiRequests from '../../utils/hooks/useFetchDoiRequests';
import { RoleName } from '../../types/user.types';
import { DoiRequestAccordion } from './DoiRequestAccordion';
import Card from '../../components/Card';
import ListSkeleton from '../../components/ListSkeleton';

const DoiRequests: FC = () => {
  const { t } = useTranslation('workLists');
  const [publicationsWithPendingDoiRequest, isLoadingPendingDoiRequests] = useFetchDoiRequests(RoleName.CURATOR);

  return isLoadingPendingDoiRequests ? (
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
  );
};

export default DoiRequests;
