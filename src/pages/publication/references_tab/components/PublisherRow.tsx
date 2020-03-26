import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { Publisher } from '../../../../types/publication.types';
import Label from '../../../../components/Label';

const StyledPublisherRow = styled.div`
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${({ theme }) => theme.palette.background.default};
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-areas:
    'titleLabel levelLabel button'
    'title level button';
  grid-template-columns: 7fr 6fr 2fr;
`;

const StyledTitle = styled(Label)`
  grid-area: titleLabel;
`;

const StyledLevelLabel = styled(Label)`
  grid-area: levelLabel;
`;

const StyledTitleText = styled.div`
  grid-area: title;
`;

const StyledLevelText = styled.div`
  grid-area: level;
`;

const StyledButton = styled(Button)`
  grid-area: button;
  margin: 0.5rem;
`;

interface PublisherRowProps {
  dataTestId: string;
  publisher: Partial<Publisher>;
  label: string;
  onClickDelete: (event: React.MouseEvent<any>) => void;
}

const PublisherRow: React.FC<PublisherRowProps> = ({ dataTestId, publisher, label, onClickDelete }) => {
  const { t } = useTranslation('publication');

  return (
    <StyledPublisherRow data-testid={dataTestId}>
      <StyledTitle>{label}</StyledTitle>
      <StyledLevelLabel>{t('references.level')}</StyledLevelLabel>
      <StyledTitleText>{publisher.title}</StyledTitleText>
      <StyledLevelText>{publisher.level}</StyledLevelText>
      <StyledButton variant="contained" color="secondary" onClick={onClickDelete}>
        {t('common:remove')}
      </StyledButton>
    </StyledPublisherRow>
  );
};

export default PublisherRow;
