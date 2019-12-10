import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonModal from '../../components/ButtonModal';
import LabelTextLine from '../../components/LabelTextLine';
import { RootStore } from '../../redux/reducers/rootReducer';
import { ORCID_BASE_URL } from '../../utils/constants';
import OrcidModal from './OrcidModal';
import UserCard from './UserCard';

const UserOrcid: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootStore) => state.user);
  const OrcidLink = `${ORCID_BASE_URL}/${user.orcid}`;

  return (
    <UserCard headerLabel={t('common:orcid')}>
      {user.orcid ? (
        <LabelTextLine
          dataTestId={'orcid-info'}
          label={t('profile:orcid.your_orcid')}
          text={OrcidLink}
          externalLink={OrcidLink}
        />
      ) : (
        <ButtonModal
          buttonText={t('profile:orcid.create_or_connect')}
          dataTestId="open-orcid-modal"
          startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
          {({ setOpen }: any) => <OrcidModal setOpen={setOpen} />}
        </ButtonModal>
      )}
    </UserCard>
  );
};

export default UserOrcid;
