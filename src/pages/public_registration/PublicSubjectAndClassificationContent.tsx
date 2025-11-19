import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { hrcsCategories } from '../../resources/vocabularies/hrcsCategories';
import { hrcsActivityBaseId, hrcsCategoryBaseId } from '../../utils/constants';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';
import { hrcsActivityOptions } from '../registration/description_tab/vocabularies/HrcsActivityInput';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';

export const PublicSubjectAndClassificationContent = ({ registration }: PublicRegistrationContentProps) => {
  const { t } = useTranslation();

  const { entityDescription, subjects } = registration;

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
      {entityDescription && entityDescription.tags.length > 0 && (
        <TagsList title={t('registration.description.keywords')} values={entityDescription.tags} />
      )}

      {selectedHrcsActivities.length > 0 && (
        <TagsList title={t('registration.description.hrcs_activities')} values={selectedHrcsActivities} />
      )}

      {selectedHrcsCategories.length > 0 && (
        <TagsList title={t('registration.description.hrcs_categories')} values={selectedHrcsCategories} />
      )}
    </>
  );
};

interface TagsListProps {
  title: string;
  values: string[];
}

const TagsList = ({ title, values }: TagsListProps) => (
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', md: 'auto 1fr' },
      columnGap: '1rem',
      alignItems: 'center',
      marginBottom: '0.5rem',
    }}>
    <Typography variant="h3" color="primary" sx={{ mb: { xs: '0.5rem', md: 0 } }}>
      {title}
    </Typography>
    <Box
      data-testid={dataTestId.registrationLandingPage.keywords}
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
      {values.map((value) => (
        <Chip key={value} color="secondary" label={<Typography>{value}</Typography>} />
      ))}
    </Box>
  </Box>
);
