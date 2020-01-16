import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonModal from '../../components/ButtonModal';
import LabelTextLine from '../../components/LabelTextLine';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModal from './OrcidModal';
import UserCard from './UserCard';
import styled from 'styled-components';

const StyledInformation = styled.div`
  margin-bottom: 1rem;
`;

const UserOrcid: FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootStore) => state.user);
  const OrcidLink = `${ORCID_BASE_URL}/${user.orcid}`;

  return (
    <UserCard
      headingLabel={t('common:orcid')}
      headingIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID icon" />}>
      {user.orcid ? (
        <LabelTextLine
          dataTestId={'orcid-info'}
          label={t('profile:orcid.your_orcid')}
          text={OrcidLink}
          externalLink={OrcidLink}
        />
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
