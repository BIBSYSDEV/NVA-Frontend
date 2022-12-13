import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { BackgroundDiv } from '../../components/styled/Wrappers';
import { useSearchRegistrations } from '../../utils/hooks/useSearchRegistrations';
import { PageSpinner } from '../../components/PageSpinner';
import { useFetch } from '../../utils/hooks/useFetch';
import { SearchResults } from '../search/SearchResults';
import { ContributorFieldNames, SpecificContributorFieldNames } from '../../types/publicationFieldNames';
import { ExpressionStatement } from '../../utils/searchHelpers';
import { CristinPerson } from '../../types/user.types';
import { UrlPathTemplate } from '../../utils/urlPaths';
import { RootState } from '../../redux/store';
import { ResearchProfileSummary } from '../my_page/user_profile/ResearchProfilePanel';

const ResearchProfile = () => {
  const { t } = useTranslation();
  const history = useHistory();

  const currentCristinId = useSelector((store: RootState) => store.user?.cristinId) ?? '';
  const isPublicPage = history.location.pathname === UrlPathTemplate.ResearchProfile;
  const personId = isPublicPage
    ? new URLSearchParams(history.location.search).get('id') ?? '' // Page for Research Profile of anyone
    : currentCristinId; // Page for My Research Profile

  const [person] = useFetch<CristinPerson>({
    url: personId,
    errorMessage: t('feedback.error.get_person'),
  });

  const [registrations, isLoadingRegistrations] = useSearchRegistrations({
    properties: [
      {
        fieldName: `${ContributorFieldNames.Contributors}.${SpecificContributorFieldNames.Id}`,
        value: personId,
        operator: ExpressionStatement.Contains,
      },
    ],
  });

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 1fr' }}>
      {isLoadingRegistrations ? (
        <PageSpinner aria-label={t('my_page.research_profile')} />
      ) : (
        person && (
          <BackgroundDiv sx={isPublicPage ? undefined : { padding: 0 }}>
            {registrations && (
              <Box>
                <Typography variant="h2" gutterBottom>
                  {t('common.registrations')}
                </Typography>
                {registrations.size > 0 ? (
                  <SearchResults searchResult={registrations} />
                ) : (
                  <Typography>{t('common.no_hits')}</Typography>
                )}
              </Box>
            )}
          </BackgroundDiv>
        )
      )}
      <ResearchProfileSummary />
    </Box>
  );
};

export default ResearchProfile;
