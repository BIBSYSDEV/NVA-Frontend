import React from 'react';
import { Publisher } from '../../../types/references.types';
import Card from '../../../components/Card';
import Heading from '../../../components/Heading';
import Label from '../../../components/Label';
import { Avatar } from '@material-ui/core';
import { openAccessLogo } from '../../../resources/images/licenses';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import NormalText from '../../../components/NormalText';

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
  const { t } = useTranslation('publication');

  return (
    <Card>
      <Heading>{t('files_and_license.info_from_publication_channel_register.title')}</Heading>
      <StyledInfoEntries>
        <div>
          <Label>{publisher.title}</Label>
          <NormalText>
            {publisher.openAccess
              ? t('files_and_license.info_from_publication_channel_register.open_publishment')
              : t('files_and_license.info_from_publication_channel_register.no_open_publishment')}
          </NormalText>
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
