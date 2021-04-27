import React from 'react';
import { Chip, Typography } from '@material-ui/core';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');

  const { abstract, description, tags } = registration.entityDescription;

  return (
    <>
      {abstract && (
        <>
          <Typography variant="h4" component="h2">
            {t('description.abstract')}
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
            {abstract}
          </Typography>
        </>
      )}
      {description && (
        <>
          <Typography variant="h4" component="h2">
            {t('description.description')}
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
            {description}
          </Typography>
        </>
      )}

      {tags.length > 0 && <TagsList title={t('description.keywords')} values={tags} />}
    </>
  );
};

const StyledTagsList = styled.div`
  display: flex;
  align-items: center;
`;

const StyledTags = styled.div`
  margin-left: 1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  > div {
    :not(:last-child) {
      margin-right: 0.5rem;
    }
  }
`;

const StyledChip = styled(Chip)`
  background: ${({ theme }) => theme.palette.section.light};
  color: ${({ theme }) => theme.palette.text.primary};
  margin: 0.25rem 0;
`;

interface TagsListProps {
  title: string;
  values: string[];
}

const TagsList = ({ title, values }: TagsListProps) => (
  <StyledTagsList>
    <Typography variant="subtitle2" component="h2">
      {title}
    </Typography>
    <StyledTags>
      {values.map((value) => (
        <StyledChip key={value} label={value} />
      ))}
    </StyledTags>
  </StyledTagsList>
);
