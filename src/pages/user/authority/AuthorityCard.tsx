import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Radio } from '@material-ui/core';

import { getPublications } from '../../../api/external/almaApi';
import { Authority } from '../../../types/authority.types';
import { AlmaPublication } from '../../../types/publication.types';

const StyledBoxContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr;
  background-color: ${({ theme }) => theme.palette.box.main};
  padding: 1rem;
`;

const StyledPublicationContent = styled.div`
  align-self: center;
`;

const StyledPublicationInfo = styled.div`
  display: block;
  font-weight: bold;
`;

interface AuthorityCardProps {
  authority: Authority;
  isSelected: boolean;
}

const AuthorityCard: React.FC<AuthorityCardProps> = ({ authority, isSelected }) => {
  const [publications, setPublications] = useState<AlmaPublication[]>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation('profile');

  useEffect(() => {
    const fetchAuthorities = async () => {
      const retrievedPublications = await getPublications(authority.systemControlNumber, dispatch);
      setPublications(retrievedPublications);
    };

    fetchAuthorities();
  }, [dispatch, authority.systemControlNumber]);

  return (
    <StyledBoxContent>
      <div>
        <Radio color="primary" checked={isSelected} />
        {authority?.name}
      </div>
      <StyledPublicationContent>
        {publications?.[0] ? (
          <div>
            <StyledPublicationInfo>{t('authority.last_publication')}</StyledPublicationInfo>
            {publications?.[0]?.title}
          </div>
        ) : (
          <i>{t('authority.no_publications_found')}</i>
        )}
      </StyledPublicationContent>
    </StyledBoxContent>
  );
};

export default AuthorityCard;
