import React, { FC } from 'react';
import { Link } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import LabelContentRow from '../../components/LabelContentRow';
import { DoiRequestStatus, Registration } from '../../types/registration.types';
import { RootStore } from '../../redux/reducers/rootReducer';

const StyledDraftSpan = styled.span`
  margin-left: 0.5rem;
`;

export interface PublicDoiProps {
  registration: Registration;
}

const PublicDoi: FC<PublicDoiProps> = ({ registration }) => {
  const { t } = useTranslation('registration');
  const user = useSelector((store: RootStore) => store.user);

  const originalDoi = registration.entityDescription.reference.doi;
  const nvaDoi = registration.doi;
  const hasApprovedDoiRequest = registration.doiRequest?.status === DoiRequestStatus.Approved;
  const canSeeDraftDoi =
    user && ((user.isCurator && registration.publisher.id === user.customerId) || user.id === registration.owner);

  const doiToPresent = nvaDoi && (hasApprovedDoiRequest || canSeeDraftDoi) ? nvaDoi : originalDoi;
  const isDraftDoi = nvaDoi && !hasApprovedDoiRequest && canSeeDraftDoi;

  return doiToPresent ? (
    <LabelContentRow data-testid="doi-presentation" minimal label={`${t('registration.link_to_resource')}:`}>
      <Link href={doiToPresent} target="_blank" rel="noopener noreferrer">
        {doiToPresent}
      </Link>
      {isDraftDoi && <StyledDraftSpan>({t('public_page.in_progess')})</StyledDraftSpan>}
    </LabelContentRow>
  ) : null;
};

export default PublicDoi;
