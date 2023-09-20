import PreviewIcon from '@mui/icons-material/Preview';
import { Box, Chip, Divider, IconButton, Typography } from '@mui/material';
import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { PageSpinner } from '../../../components/PageSpinner';
import { AffiliationHierarchy } from '../../../components/institution/AffiliationHierarchy';
import orcidIcon from '../../../resources/images/orcid_logo.svg';
import { CristinPerson } from '../../../types/user.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getContributorInitials } from '../../../utils/registration-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { filterActiveAffiliations, getFullCristinName, getOrcidUri } from '../../../utils/user-helpers';
import { StyledBaseContributorIndicator } from '../../registration/contributors_tab/ContributorIndicator';

interface ResearchProfilePanelProps {
  person?: CristinPerson;
  isLoadingPerson: boolean;
}

export const ResearchProfilePanel = ({ person, isLoadingPerson }: ResearchProfilePanelProps) => {
  const { t } = useTranslation();

  const fullName = person?.names ? getFullCristinName(person.names) : '';
  const orcidUri = getOrcidUri(person?.identifiers);
  const activeAffiliations = person?.affiliations ? filterActiveAffiliations(person.affiliations) : [];
  const personBackground = getLanguageString(person?.background) ?? '';
  const personKeywords = person?.keywords ?? [];

  return (
    <>
      <Helmet>
        <title>{fullName}</title>
      </Helmet>
      <Box sx={{ bgcolor: 'person.main', height: '100%', padding: '0.5rem' }}>
        {isLoadingPerson ? (
          <PageSpinner aria-label={t('my_page.research_profile')} />
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PreviewIcon />
              <Typography variant="h3" component="span" sx={{ textTransform: 'none' }}>
                {t('my_page.my_profile.research_profile_summary.preview')}
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr', alignItems: 'center', mt: '1rem' }}>
              <Typography variant="h2">{t('my_page.my_profile.research_profile_summary.research_profile')}</Typography>
              <StyledBaseContributorIndicator
                sx={{ bgcolor: 'primary.main', color: 'white', height: '2.5rem', width: '2.5rem', fontSize: '1.5rem' }}
                data-testid={dataTestId.registrationLandingPage.tasksPanel.assigneeIndicator}>
                {getContributorInitials(fullName)}
              </StyledBaseContributorIndicator>
            </Box>

            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center', mt: '0.5rem' }}>
              <Typography variant="h3">{fullName}</Typography>
              {orcidUri && (
                <IconButton size="small" href={orcidUri} target="_blank">
                  <img src={orcidIcon} height="20" alt="orcid" />
                </IconButton>
              )}
            </Box>

            <Typography sx={{ mt: '3rem', mb: '0.5rem' }} variant="h3">
              {t('my_page.my_profile.research_profile_summary.affiliations')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {activeAffiliations.map((affiliation, index) => (
                <Fragment key={index}>
                  <AffiliationHierarchy key={affiliation.organization + index} unitUri={affiliation.organization} />
                  <Divider />
                </Fragment>
              ))}
            </Box>
            {personKeywords.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', mt: '1rem' }}>
                <Typography variant="h3">{t('my_page.my_profile.field_and_background.field')}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {personKeywords.map((keyword) => (
                    <Chip
                      sx={{
                        maxWidth: 'fit-content',
                        borderRadius: '4px',
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'primary.main',
                        width: 'max-content',
                      }}
                      key={keyword.type}
                      label={getLanguageString(keyword.label)}
                      variant="filled"
                    />
                  ))}
                </Box>
              </Box>
            )}
            {!!personBackground && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', mt: '1rem' }}>
                <Typography variant="h3">{t('my_page.my_profile.background')}</Typography>
                <Typography>{personBackground}</Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
};
