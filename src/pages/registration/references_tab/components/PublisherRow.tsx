import React, { useEffect, FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import { FormikProps, useFormikContext } from 'formik';
import { Publisher, levelMap, Registration } from '../../../../types/registration.types';
import { getPublishers } from '../../../../api/publicationChannelApi';
import { PublicationTableNumber } from '../../../../utils/constants';
import { ReferenceFieldNames } from '../../../../types/publicationFieldNames';
import Card from '../../../../components/Card';

const StyledPublisherCard = styled(Card)`
  margin: 1rem 0;
  padding: 1rem;
  display: grid;
  grid-column-gap: 0.5rem;
  grid-template-areas:
    'titleLabel levelLabel button'
    'title level button';
  grid-template-columns: 7fr 6fr 2fr;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.sm + 'px'}) {
    grid-template-areas: 'titleLabel title title' 'levelLabel level level' '. . button';
    grid-template-columns: 1fr 1fr 1fr;
    gap: 1rem;
  }
`;

const StyledTitle = styled(Typography)`
  grid-area: titleLabel;
`;

const StyledLevelLabel = styled(Typography)`
  grid-area: levelLabel;
`;

const StyledTitleText = styled(Typography)`
  grid-area: title;
`;

const StyledLevelText = styled(Typography)`
  grid-area: level;
`;

const StyledButton = styled(Button)`
  grid-area: button;
  margin: 0.5rem;
`;

interface PublisherRowProps {
  dataTestId: string;
  label: string;
  onClickDelete: (event: React.MouseEvent<any>) => void;
  publisher: Partial<Publisher>;
}

const PublisherRow: FC<PublisherRowProps> = ({ dataTestId, label, onClickDelete, publisher }) => {
  const { t } = useTranslation('registration');

  const { setFieldValue }: FormikProps<Registration> = useFormikContext();

  const { level, title } = publisher;
  const publisherLevel = typeof level === 'string' ? levelMap[level] : level;

  useEffect(() => {
    const setLevel = async (title: string) => {
      const response = await getPublishers(title, PublicationTableNumber.PUBLICATION_CHANNELS);
      if (response?.data) {
        const publisherLevel = response.data.results.filter(
          (publisher: Partial<Publisher>) => publisher.title === title
        )[0]?.level;
        if (publisherLevel) {
          const levelAsEnum = Object.keys(levelMap).find((key) => levelMap[key] === publisherLevel);
          setFieldValue(ReferenceFieldNames.PUBLICATION_CONTEXT_LEVEL, levelAsEnum);
        }
      } else {
        setFieldValue(ReferenceFieldNames.PUBLICATION_CONTEXT_LEVEL, '');
      }
    };

    if (title && !level) {
      setLevel(title);
    }
  }, [level, setFieldValue, title]);

  return (
    <StyledPublisherCard data-testid={dataTestId}>
      <StyledTitle variant="h6">{label}</StyledTitle>
      <StyledLevelLabel variant="h6">{t('references.level')}</StyledLevelLabel>
      <StyledTitleText>{title}</StyledTitleText>
      <StyledLevelText>{publisherLevel}</StyledLevelText>
      <StyledButton data-testid="remove-publisher" variant="contained" color="secondary" onClick={onClickDelete}>
        {t('common:remove')}
      </StyledButton>
    </StyledPublisherCard>
  );
};

export default PublisherRow;
