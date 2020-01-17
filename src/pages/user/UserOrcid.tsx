import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ButtonModal from '../../components/ButtonModal';
import LabelTextLine from '../../components/LabelTextLine';
import { RootStore } from '../../redux/reducers/rootReducer';
import orcidIcon from '../../resources/images/orcid_24x24.png';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModal from './OrcidModal';
import UserCard from './UserCard';

const StyledInformation = styled.div`
  margin-bottom: 1rem;
`;

const UserOrcid: FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootStore) => state.user);
  const listOfOrcids = user.authority?.orcids;

  return (
    <UserCard headingLabel={t('common:orcid')} headingIcon={<img src={orcidIcon} alt="ORCID icon" />}>
      {listOfOrcids?.length > 0 ? (
        listOfOrcids.map((orcid: string) => {
          const orcidLink = `${ORCID_BASE_URL}/${orcid}`;
          return (
            <LabelTextLine
              key={orcid}
              dataTestId={'orcid-info'}
              label={t('profile:orcid.your_orcid')}
              text={orcidLink}
              externalLink={orcidLink}
            />
          );
        })
      ) : (
        <>
          <StyledInformation>{t('profile:orcid.description_why_use_orcid')}</StyledInformation>
          <ButtonModal
            buttonText={t('profile:orcid.create_or_connect')}
            dataTestId="open-orcid-modal"
            headingText={t('profile:orcid.create_or_connect')}>
            <OrcidModal />
          </ButtonModal>
        </>
      )}
    </UserCard>
  );
};

export default UserOrcid;
