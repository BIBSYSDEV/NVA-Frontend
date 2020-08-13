import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button } from '@material-ui/core';
import Label from '../../../../components/Label';
import Card from '../../../../components/Card';
import NormalText from '../../../../components/NormalText';

const StyledSeriesRow = styled(Card)`
  margin: 1rem 0;
  padding: 1rem;
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-areas:
    'titleLabel button'
    'title button';
  grid-template-columns: 13fr 2fr;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'titleLabel title' '. button';
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
`;

const StyledTitle = styled(Label)`
  grid-area: titleLabel;
`;

const StyledTitleText = styled(NormalText)`
  grid-area: title;
`;

const StyledButton = styled(Button)`
  grid-area: button;
  margin: 0.5rem;
`;

interface PublisherRowProps {
  dataTestId: string;
  label: string;
  onClickDelete: (event: React.MouseEvent<any>) => void;
  title: string;
}

const SeriesRow: FC<PublisherRowProps> = ({ dataTestId, label, onClickDelete, title }) => {
  const { t } = useTranslation('publication');

  return (
    <StyledSeriesRow data-testid={dataTestId}>
      <StyledTitle>{label}</StyledTitle>
      <StyledTitleText>{title}</StyledTitleText>
      <StyledButton data-testid="remove-publisher" variant="contained" color="secondary" onClick={onClickDelete}>
        {t('common:remove')}
      </StyledButton>
    </StyledSeriesRow>
  );
};

export default SeriesRow;
