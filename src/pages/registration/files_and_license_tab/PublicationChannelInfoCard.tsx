import React from 'react';
import { Publisher } from '../../../types/publication.types';
import Card from '../../../components/Card';
import { Avatar, Typography } from '@material-ui/core';
import { openAccessLogo } from '../../../resources/images/licenses';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const StyledInfoEntries = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledAvatar = styled(Avatar)`
  object-fit: contain;
  height: 100%;
`;

interface PublicationChannelInfoCardProps {
  publisher: Publisher;
}

const PublicationChannelInfoCard: React.FC<PublicationChannelInfoCardProps> = ({ publisher }) => {
  const { t } = useTranslation('registration');

  return (
    <Card>
      <Typography variant="h5">{t('files_and_license.info_from_publication_channel_register.title')}</Typography>
      <StyledInfoEntries>
        <div>
          <Typography variant="h6">{publisher.title}</Typography>
          <Typography>
            {publisher.openAccess
              ? t('files_and_license.info_from_publication_channel_register.open_publishment')
              : t('files_and_license.info_from_publication_channel_register.no_open_publishment')}
          </Typography>
        </div>
        {publisher.openAccess && (
          <StyledAvatar
            variant="square"
            src={openAccessLogo}
            alt={t('files_and_license.info_from_publication_channel_register.open_access')}
          />
        )}
      </StyledInfoEntries>
    </Card>
  );
};

export default PublicationChannelInfoCard;
