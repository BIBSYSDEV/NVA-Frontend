import styled from 'styled-components';

export const StyledUserPage = styled.div`
  display: grid;
  grid-template-areas: 'secondary-info primary-info';
  grid-template-columns: 1fr 3fr;
  grid-gap: 3rem;
  font-size: 1rem;
  padding: 2rem;
`;

export const StyledSecondaryUserInfo = styled.div`
  display: grid;
  grid-area: secondary-info;
  grid-template-areas: 'profile-image' 'contact-info' 'language' 'author-info';
  grid-row-gap: 3rem;
  min-width: 20rem;
`;

export const StyledPrimaryUserInfo = styled.div`
  display: grid;
  grid-area: primary-info;
  grid-gap: 3rem;
`;
