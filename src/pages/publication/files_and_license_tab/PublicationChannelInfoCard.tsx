import React from 'react';
import { Publisher } from '../../../types/references.types';
import FormCard from '../../../components/FormCard/FormCard';
import FormCardHeading from '../../../components/FormCard/FormCardHeading';
import FormCardLabel from '../../../components/FormCard/FormCardLabel';
import { Typography, Avatar } from '@material-ui/core';
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
  const { t } = useTranslation('publication');

  return (
    <FormCard>
      <FormCardHeading>{t('files_and_license.info_from_publication_channel_register.title')}</FormCardHeading>
      <StyledInfoEntries>
        <div>
          <FormCardLabel>{publisher.title}</FormCardLabel>
          <Typography variant="body1">
            {publisher.isOpenAccess
              ? t('files_and_license.info_from_publication_channel_register.open_publishment')
              : t('files_and_license.info_from_publication_channel_register.no_open_publishment')}
          </Typography>
        </div>
        {publisher.isOpenAccess && (
          <StyledAvatar
            variant="square"
            src={openAccessLogo}
            alt={t('files_and_license.info_from_publication_channel_register.open_access')}
          />
        )}
      </StyledInfoEntries>
    </FormCard>
  );
};

export default PublicationChannelInfoCard;
