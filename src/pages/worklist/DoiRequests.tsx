import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';

import SubHeading from '../../components/SubHeading';
import useFetchDoiRequests from '../../utils/hooks/useFetchDoiRequests';
import { RoleName } from '../../types/user.types';

const DoiRequests: FC = () => {
  const { t } = useTranslation('workLists');
  const [doiRequests, isLoadingDoiRequests] = useFetchDoiRequests(RoleName.CURATOR);

  return isLoadingDoiRequests ? (
    <CircularProgress />
  ) : doiRequests.length === 0 ? (
    <SubHeading>{t('no_pending_doi_requests')}</SubHeading>
  ) : (
    <>TODO</>
  );
};

export default DoiRequests;
