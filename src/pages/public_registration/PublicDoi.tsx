import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Link, Typography } from '@material-ui/core';
import { RootStore } from '../../redux/reducers/rootReducer';
import { DoiRequestStatus, Registration } from '../../types/registration.types';

const StyledDraftSpan = styled.span`
  margin-left: 0.5rem;
`;

const StyledPublicDoi = styled.div`
  margin-top: 1.5rem;
`;

interface PublicDoiProps {
  registration: Registration;
}

export const PublicDoi = ({ registration }: PublicDoiProps) => {
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
    <StyledPublicDoi>
      <Typography
        component={Link}
        data-testid="doi-presentation"
        href={doiToPresent}
        target="_blank"
        rel="noopener noreferrer">
        {doiToPresent}
        {isDraftDoi && <StyledDraftSpan>({t('public_page.in_progess')})</StyledDraftSpan>}
      </Typography>
    </StyledPublicDoi>
  ) : null;
};
