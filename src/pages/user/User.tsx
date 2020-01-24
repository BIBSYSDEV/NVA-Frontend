import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';

import { Link as MuiLink } from '@material-ui/core';

import { getAuthorities, updateOrcidForAuthority } from '../../api/authorityApi';
import { getOrcidInfo } from '../../api/external/orcidApi';
import ButtonModal from '../../components/ButtonModal';
import { setAuthorityData } from '../../redux/actions/userActions';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ConnectAuthority } from './authority/ConnectAuthority';
import UserCard from './UserCard';
import UserInfo from './UserInfo';
import UserLanguage from './UserLanguage';
import UserOrcid from './UserOrcid';
import UserRoles from './UserRoles';
import InstitutionDialog from './InstitutionDialog';
import { InstitutionPresentationModel } from './../../types/institution.types';
import InstitutionPresentation from './InstitutionPresentation';

const StyledUserPage = styled.div`
  display: grid;
  @media (min-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-areas: 'secondary-info primary-info';
    grid-template-columns: 1fr 3fr;
  }
  grid-gap: 3rem;
  font-size: 1rem;
  grid-template-areas: 'primary-info' 'secondary-info';
`;

const StyledSecondaryUserInfo = styled.div`
  display: grid;
  grid-area: secondary-info;
  grid-template-areas: 'profile-image' 'contact-info' 'language' 'roles';
  grid-row-gap: 3rem;
`;

const StyledPrimaryUserInfo = styled.div`
  display: grid;
  grid-area: primary-info;
  grid-row-gap: 3rem;
`;

const User: React.FC = () => {
  const { t } = useTranslation('profile');
  const user = useSelector((state: RootStore) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const [institutionPresentations, setInstitutionPresentations] = useState<InstitutionPresentationModel[]>([]);

  const hasHandles = user.authority?.handles?.length > 0;
  const hasFeide = user.authority?.feideids?.length > 0;

  useEffect(() => {
    const orcidAccessToken = new URLSearchParams(location.hash.replace('#', '?')).get('access_token') || '';
    if (orcidAccessToken) {
      dispatch(getOrcidInfo(orcidAccessToken));
      history.push('/user');
    }
  }, [dispatch, location.hash, history]);

  useEffect(() => {
    const updateOrcid = async () => {
      if (user.authority?.systemControlNumber && !user.authority?.orcids.includes(user.externalOrcid)) {
        const updatedAuthority = await updateOrcidForAuthority(
          user.externalOrcid,
          user.authority.systemControlNumber,
          dispatch
        );
        dispatch(setAuthorityData(updatedAuthority));
      } else {
        await getAuthorities(user.id, dispatch);
      }
    };
    if (user.externalOrcid) {
      updateOrcid();
    }
  }, [user.authority, dispatch, user.id, user.externalOrcid]);

  const addInstitutionPresentation = (institutionPresentation: InstitutionPresentationModel) => {
    setInstitutionPresentations([...institutionPresentations, institutionPresentation]);
  };

  return (
    <StyledUserPage>
      <StyledSecondaryUserInfo>
        <UserCard headingLabel={t('picture')} />
        <UserCard headingLabel={t('heading.contact_info')} />
        <UserLanguage />
        <UserRoles user={user} />
      </StyledSecondaryUserInfo>

      <StyledPrimaryUserInfo>
        <UserInfo user={user} />
        <UserCard headingLabel={t('heading.author_info')}>
          {hasFeide ? (
            <>
              <p data-testid="author-connected-info">{t('authority.connected_info')}</p>
              {hasHandles && <MuiLink href={user.authority.handles?.[0]}>{t('authority.see_profile')}</MuiLink>}
            </>
          ) : (
            <>
              <p>{t('authority.not_connected_info')}</p>
              <ButtonModal
                buttonText={t('authority.connect_authority')}
                dataTestId="connect-author-modal"
                ariaLabelledBy="connect-author-modal"
                headingText={t('authority.connect_authority')}>
                <ConnectAuthority />
              </ButtonModal>
            </>
          )}
        </UserCard>
        <UserOrcid />
        <UserCard headingLabel={t('heading.organizations')}>
          <InstitutionDialog user={user} addInstitutionPresentation={addInstitutionPresentation} />
          <>
            {institutionPresentations.map((presentation: InstitutionPresentationModel) => (
              <InstitutionPresentation
                key={presentation.cristinUnitId}
                institution={presentation.institutionName}
                level1={presentation.level1Name}
                level2={presentation.level2Name}
              />
            ))}
          </>
        </UserCard>
      </StyledPrimaryUserInfo>
    </StyledUserPage>
  );
};

export default User;
