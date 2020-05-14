import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { Button } from '@material-ui/core';

import { Publisher, levelMap, FormikPublication } from '../../../../types/publication.types';
import Label from '../../../../components/Label';
import { getPublishers } from '../../../../api/publicationChannelApi';
import { PublicationTableNumber } from '../../../../utils/constants';
import { FormikProps, useFormikContext } from 'formik';
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

  const { setFieldValue }: FormikProps<FormikPublication> = useFormikContext();

  const { level, title } = publisher;
  const publisherLevel = typeof level === 'string' ? levelMap[level] : level;

  useEffect(() => {
    const setLevel = async (title: string) => {
      const response = await getPublishers(title, PublicationTableNumber.PUBLICATION_CHANNELS);
      // TODO: set level in doi-fetch ? book = PublicationTableNumber.PUBLISHERS ? needs further discussion
      if (response) {
        const publisherLevel = response?.filter((publisher: Partial<Publisher>) => publisher.title === title)[0]?.level;
        if (publisherLevel) {
          const levelAsEnum = Object.keys(levelMap).find((key) => levelMap[key] === publisherLevel);
          setFieldValue(`${ReferenceFieldNames.PUBLICATION_CONTEXT}.level`, levelAsEnum);
        }
      } else {
        setFieldValue(`${ReferenceFieldNames.PUBLICATION_CONTEXT}.level`, '');
      }
    };

    if (title && !level) {
      setLevel(title);
    }
  }, [level, setFieldValue, title]);

  return (
    <StyledPublisherCard data-testid={dataTestId}>
      <StyledTitle>{label}</StyledTitle>
      <StyledLevelLabel>{t('references.level')}</StyledLevelLabel>
      <StyledTitleText>{title}</StyledTitleText>
      <StyledLevelText>{publisherLevel}</StyledLevelText>
      <StyledButton data-testid="remove-publisher" variant="contained" color="secondary" onClick={onClickDelete}>
        {t('common:remove')}
      </StyledButton>
    </StyledPublisherCard>
  );
};

export default PublisherRow;
