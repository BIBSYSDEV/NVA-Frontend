import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Authority } from '../../../types/authority.types';
import AuthorityCard from './AuthorityCard';

const StyledAuthorityContainer = styled.div`
  > * {
    margin-top: 1rem;
  }
`;

const StyledClickableDiv = styled.div`
  cursor: pointer;
`;

const StyledSubHeading = styled.div`
  text-align: right;
  font-weight: bold;
`;

interface AuthorityListProps {
  authorities: Authority[];
  searchTerm: string;
  onSelectAuthority: (authority: Authority) => void;
  selectedSystemControlNumber?: string;
}

export const AuthorityList: FC<AuthorityListProps> = ({
  authorities,
  searchTerm,
  onSelectAuthority,
  selectedSystemControlNumber = '',
}) => {
  const { t } = useTranslation('profile');
  return (
    <>
      <StyledAuthorityContainer>
        <StyledSubHeading>
          {t('authority.search_summary', { results: authorities?.length ?? 0, searchTerm: searchTerm })}
        </StyledSubHeading>
        {authorities.map((authority) => (
          <StyledClickableDiv
            data-testid="author-radio-button"
            key={authority.systemControlNumber}
            onClick={() => onSelectAuthority(authority)}>
            <AuthorityCard
              authority={authority}
              isSelected={selectedSystemControlNumber === authority.systemControlNumber}
            />
          </StyledClickableDiv>
        ))}
      </StyledAuthorityContainer>
    </>
  );
};
