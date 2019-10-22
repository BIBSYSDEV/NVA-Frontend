import '../../styles/user.scss';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';

import ButtonModal from '../../components/ButtonModal';
import UserCard from './UserCard';

const UserOrcid: React.FC = () => {
  const { t } = useTranslation();

  const openORCID = () => {
    window.open(
      'https://sandbox.orcid.org/signin?oauth&client_id=0000-0002-1223-3173&response_type=code&scope=/authenticate&redirect_uri=http://localhost:3000',
      '_blank',
      'toolbar=no, scrollbars=yes, width=500, height=600, top=500, left=500, rel="noopener noreferrer"'
    );
  };

  return (
    <UserCard headerLabel={t('ORCID')} className="user__orcid-info">
      <ButtonModal
        buttonText={t('Create or Connect to your ORCID')}
        startIcon={<img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />}>
        <div className="orcid-modal">
          <h5>Registrering 2/2</h5>
          <h3>Opprett eller velg din ORCID</h3>
          <p>Logg inn på din ORCID eller lag ny dersom du ikke har.</p>
          <div className="orcid-button">
            <Button
              onClick={openORCID}
              variant="outlined"
              size="large"
              startIcon={
                <img src="https://orcid.org/sites/default/files/images/orcid_24x24.png" alt="ORCID iD icon" />
              }>
              {t('Create or Connect to your ORCID')}
            </Button>
          </div>
          <b>
            <h4>Hvorfor ber vi om ORCID?</h4>
          </b>
          <p>
            Med ORCID blir det enklere å identifisere deg som forfatter. Vi kan også hente informasjon fra ORCID, som
            kan gjøre det raskere for deg å registrere dine publikasjoner
          </p>
          <b>
            <h4>Hva er ORCID?</h4>
          </b>
          <p>
            ORCID is an independent non-profit effort to provide an open registry of unique researcher identifiers and
            open services to link research activities and organizations to these identifiers. Learn more at{' '}
            <a href="https://orcid.org">orcid.org</a>
          </p>
          <div className="skip">
            <Link to="/">Hopp over nå (kan gjøres under "profil" senere)</Link>
          </div>
        </div>
      </ButtonModal>
    </UserCard>
  );
};

export default UserOrcid;
