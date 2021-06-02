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
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 1rem;
  align-items: center;
  @media (max-width: ${({ theme }) => theme.breakpoints.values.md + 'px'}) {
    grid-template-columns: 1fr;
  }
`;

const StyledTags = styled.div`
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
  margin: 0.25rem 0;
  padding: 0.25rem;
  height: auto;
`;

const StyledChipLabel = styled(Typography)`
  white-space: normal;
  color: ${({ theme }) => theme.palette.text.primary};
`;

interface TagsListProps {
  title: string;
  values: string[];
}

const TagsList = ({ title, values }: TagsListProps) => (
  <StyledTagsList>
    <Typography variant="overline" component="h2">
      {title}
    </Typography>
    <StyledTags>
      {values.map((value) => (
        <StyledChip key={value} label={<StyledChipLabel>{value}</StyledChipLabel>} />
      ))}
    </StyledTags>
  </StyledTagsList>
);
