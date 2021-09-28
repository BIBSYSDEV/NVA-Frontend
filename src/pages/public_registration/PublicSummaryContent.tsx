import React from 'react';
import { Chip, Typography } from '@mui/material';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';
import { hrcsCategories } from '../../resources/vocabularies/hrcsCategories';
import { hrcsActivityOptions } from '../registration/description_tab/vocabularies/HrcsActivityInput';
import { hrcsActivityBaseId, hrcsCategoryBaseId } from '../../utils/constants';

export const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation('registration');

  const {
    entityDescription: { abstract, description, tags },
    subjects,
  } = registration;

  const selectedHrcsActivities = subjects
    .filter((subjectId) => subjectId.startsWith(hrcsActivityBaseId))
    .map((activityId) => {
      const matchingActivity = hrcsActivityOptions.find((activity) => activity.id === activityId);
      return matchingActivity ? getLanguageString(matchingActivity.label) : '';
    });

  const selectedHrcsCategories = subjects
    .filter((subjectId) => subjectId.startsWith(hrcsCategoryBaseId))
    .map((categoryId) => {
      const matchingCategory = hrcsCategories.categories.find((category) => category.id === categoryId);
      return matchingCategory ? getLanguageString(matchingCategory.label) : '';
    });

  return (
    <>
      {abstract && (
        <>
          <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
            {abstract}
          </Typography>
        </>
      )}
      {description && (
        <>
          <Typography variant="overline" component="h3" color="primary">
            {t('description.description')}
          </Typography>
          <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
            {description}
          </Typography>
        </>
      )}

      {tags.length > 0 && <TagsList title={t('description.keywords')} values={tags} />}

      {selectedHrcsActivities.length > 0 && (
        <TagsList title={t('description.hrcs_activities')} values={selectedHrcsActivities} />
      )}

      {selectedHrcsCategories.length > 0 && (
        <TagsList title={t('description.hrcs_categories')} values={selectedHrcsCategories} />
      )}
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
    <Typography variant="overline" component="h3" color="primary">
      {title}
    </Typography>
    <StyledTags data-testid={dataTestId.registrationLandingPage.keywords}>
      {values.map((value) => (
        <StyledChip key={value} label={<StyledChipLabel>{value}</StyledChipLabel>} />
      ))}
    </StyledTags>
  </StyledTagsList>
);
