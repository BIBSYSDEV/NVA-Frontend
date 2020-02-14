import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import styled from 'styled-components';

import { Link as MuiLink, Button } from '@material-ui/core';

import { updateOrcidForAuthority, updateInstitutionForAuthority } from '../../api/authorityApi';
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
import { InstitutionUnit, emptyInstitutionUnit } from './../../types/institution.types';
import InstitutionPresentationCard from './InstitutionPresentationCard';
import { addInstitutionUnit } from '../../redux/actions/institutionActions';
import { getInstitutionUnitNames } from '../../api/institutionApi';
import { addNotification } from '../../redux/actions/notificationActions';

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
  const [institutionUnits, setInstitutionUnits] = useState<InstitutionUnit[]>([]);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

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
        const updatedAuthority = await updateOrcidForAuthority(user.externalOrcid, user.authority.systemControlNumber);
        dispatch(setAuthorityData(updatedAuthority));
      }
    };
    if (user.externalOrcid) {
      updateOrcid();
    }
  }, [user.authority, dispatch, user.externalOrcid]);

  useEffect(() => {
    const newInstitutionUnits: InstitutionUnit[] = [];
    institutionUnits.forEach(institutionUnit => {
      !user.institutionUnits.find(
        storedInstitutionUnit => storedInstitutionUnit.cristinUnitId === institutionUnit.cristinUnitId
      ) ?? newInstitutionUnits.push(institutionUnit);
    });
    newInstitutionUnits.forEach(institutionUnit => {
      if (institutionUnit.cristinUnitId !== '') dispatch(addInstitutionUnit(institutionUnit));
    });
  }, [institutionUnits, user.institutionUnits, dispatch]);

  const handleClickAdd = () => setInstitutionUnits([...institutionUnits, emptyInstitutionUnit]);

  const addInstitution = async (cristinUnitId: string) => {
    const updateAuthority = async (cristinUnitId: string) => {
      if (!user.authority.orgunitids?.find(orgunitid => orgunitid === cristinUnitId)) {
        const updatedAuthority = await updateInstitutionForAuthority(cristinUnitId, user.authority.systemControlNumber);
        if (updatedAuthority?.error) {
          dispatch(addNotification(updatedAuthority.error, 'error'));
        } else if (updatedAuthority) {
          dispatch(setAuthorityData(updatedAuthority));
          try {
            const institutionUnit = await getInstitutionUnitNames(cristinUnitId);
            if (institutionUnit.cristinUnitId !== '') dispatch(addInstitutionUnit(institutionUnit));
          } catch {}
        }
      }
    };

    if (!institutionUnits.find(institutionUnit => institutionUnit.cristinUnitId === cristinUnitId)) {
      const newInstitutionUnit: InstitutionUnit = await getInstitutionUnitNames(cristinUnitId);
      setInstitutionUnits([
        ...institutionUnits.filter(institutionUnit => institutionUnit.cristinUnitId !== ''),
        newInstitutionUnit,
      ]);

      // updateAuthority(cristinUnitId);
    } else {
      setInstitutionUnits(institutionUnits.filter(institutionUnit => institutionUnit.cristinUnitId !== ''));
    }
  };

  return (
    <StyledUserPage>
      <StyledSecondaryUserInfo>
        <UserCard headingLabel={t('common:picture')} />
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
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickAdd}
              disabled={!user.authority?.systemControlNumber}
              data-testid="add-new-institution-button">
              {t('common:add')}
            </Button>
            {institutionUnits.map((institutionUnit: InstitutionUnit) => (
              <InstitutionPresentationCard
                key={institutionUnit.cristinUnitId}
                institutionUnit={institutionUnit}
                addNewInstitutionUnit={addInstitution}
              />
            ))}
          </>
        </UserCard>
      </StyledPrimaryUserInfo>
    </StyledUserPage>
  );
};

export default User;
