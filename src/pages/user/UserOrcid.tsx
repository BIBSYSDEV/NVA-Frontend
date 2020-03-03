import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import ButtonModal from '../../components/ButtonModal';
import LabelTextLine from '../../components/LabelTextLine';
import { RootStore } from '../../redux/reducers/rootReducer';
import orcidIcon from '../../resources/images/orcid_logo.svg';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModal from './OrcidModal';
import Heading from '../../components/Heading';
import Card from '../../components/Card';
import { Avatar } from '@material-ui/core';

const StyledInformation = styled.div`
  margin-bottom: 1rem;
`;

const StyledAvatar = styled(Avatar)`
  display: inline-flex;
  margin-right: 0.5rem;
  top: 0.5rem;
`;

const UserOrcid: FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootStore) => state.user);
  const listOfOrcids = user.authority?.orcids;

  return (
    <Card>
      <Heading>
        <StyledAvatar src={orcidIcon} alt="ORCID icon" />
        {t('common:orcid')}
      </Heading>
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
    </Card>
  );
};

export default UserOrcid;
