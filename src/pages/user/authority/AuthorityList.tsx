import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Authority } from '../../../types/authority.types';
import AuthorityCard from './AuthorityCard';
import Label from '../../../components/Label';

const StyledAuthorityContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

const StyledClickableDiv = styled.div`
  cursor: pointer;
`;

interface AuthorityListProps {
  authorities: Authority[];
  searchTerm: string;
  onSelectAuthority: (authority: Authority) => void;
  selectedSystemControlNumber?: string;
}

const AuthorityList: FC<AuthorityListProps> = ({
  authorities,
  searchTerm,
  onSelectAuthority,
  selectedSystemControlNumber,
}) => {
  const { t } = useTranslation('common');

  return (
    <StyledAuthorityContainer>
      <Label>{t('search_summary', { count: authorities?.length ?? 0, searchTerm })}</Label>
      {authorities.map((authority) => (
        <StyledClickableDiv
          data-testid="author-radio-button"
          key={authority.id}
          onClick={() => onSelectAuthority(authority)}>
          <AuthorityCard authority={authority} isSelected={selectedSystemControlNumber === authority.id} />
        </StyledClickableDiv>
      ))}
    </StyledAuthorityContainer>
  );
};

export default AuthorityList;
