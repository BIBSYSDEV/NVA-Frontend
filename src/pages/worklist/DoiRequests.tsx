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
  const [doiRequests, isLoadingDoiRequests] = useFetchDoiRequests(RoleName.CURATOR);

  return isLoadingDoiRequests ? (
    <ListSkeleton minWidth={100} maxWidth={100} height={100} />
  ) : doiRequests.length === 0 ? (
    <Card>
      <SubHeading>{t('doi_requests.no_pending_doi_requests')}</SubHeading>
    </Card>
  ) : (
    <>
      {doiRequests.map((doiRequest) => (
        <DoiRequestAccordion key={doiRequest.publicationIdentifier} doiRequest={doiRequest} />
      ))}
    </>
  );
};

export default DoiRequests;
