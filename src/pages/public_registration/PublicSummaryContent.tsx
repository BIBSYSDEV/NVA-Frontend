import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PublicRegistrationContentProps } from './PublicRegistrationContent';
import { dataTestId } from '../../utils/dataTestIds';
import { getLanguageString } from '../../utils/translation-helpers';
import { hrcsCategories } from '../../resources/vocabularies/hrcsCategories';
import { hrcsActivityOptions } from '../registration/description_tab/vocabularies/HrcsActivityInput';
import { hrcsActivityBaseId, hrcsCategoryBaseId } from '../../utils/constants';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const PublicSummaryContent = ({ registration }: PublicRegistrationContentProps) => {
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
      {entityDescription && (
        <>
          {entityDescription.abstract && (
            <Typography style={{ whiteSpace: 'pre-line' }}>{entityDescription.abstract}</Typography>
          )}
          {entityDescription.alternativeAbstracts.und && (
            <Accordion elevation={0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />} sx={{ padding: '0' }}>
                <Typography variant="h3" color="primary">
                  {t('registration.description.alternative_abstract')}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
                  {entityDescription.alternativeAbstracts.und}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
          {entityDescription.description && (
            <>
              <Typography variant="h3" color="primary">
                {t('common.description')}
              </Typography>
              <Typography style={{ whiteSpace: 'pre-line' }} paragraph>
                {entityDescription.description}
              </Typography>
            </>
          )}

          {entityDescription.tags.length > 0 && (
            <TagsList title={t('registration.description.keywords')} values={entityDescription.tags} />
          )}
        </>
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
    <Typography variant="h3" color="primary">
      {title}
    </Typography>
    <Box
      data-testid={dataTestId.registrationLandingPage.keywords}
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
      {values.map((value) => (
        <Chip key={value} color="primary" label={<Typography>{value}</Typography>} />
      ))}
    </Box>
  </Box>
);
