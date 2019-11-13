import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ButtonModal from '../../components/ButtonModal';
import { RootStore } from '../../redux/reducers/rootReducer';
import UserCard from './UserCard';
import LabelTextLine from '../../components/LabelTextLine';
import OrcidModal from './OrcidModal';

const UserOrcid: React.FC = () => {
  const { t } = useTranslation();
  const user = useSelector((state: RootStore) => state.user);
  const OrcidLink = `https://orcid.org/${user.orcid}`;

  return (
    <UserCard headerLabel={t('ORCID')}>
      {user.orcid ? (
        <LabelTextLine dataTestId={'orcid-info'} label={t('Your ORCID')} text={OrcidLink} externalLink={OrcidLink} />
      ) : (
        <ButtonModal
          buttonText={t('Create or Connect to your ORCID')}
          dataTestId="open-orcid-modal"
          startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
          {({ setOpen }: any) => <OrcidModal setOpen={setOpen} />}
        </ButtonModal>
      )}
    </UserCard>
  );
};

export default UserOrcid;
