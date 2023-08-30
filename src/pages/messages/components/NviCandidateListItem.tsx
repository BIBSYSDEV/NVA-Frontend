import { Box, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { SearchListItem } from '../../../components/styled/Wrappers';
import { RootState } from '../../../redux/store';
import { NviCandidate } from '../../../types/nvi.types';
import { getTitleString } from '../../../utils/registration-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';
import { getResearchProfilePath } from '../../../utils/urlPaths';

interface NviCandidateListItemProps {
  nviCandidate: NviCandidate;
}

export const NviCandidateListItem = ({ nviCandidate }: NviCandidateListItemProps) => {
  const { t } = useTranslation();
  const user = useSelector((store: RootState) => store.user);

  const focusedContributors = nviCandidate.publicationDetails.contributors.slice(0, 5);
  const countRestContributors = nviCandidate.publicationDetails.contributors.length - focusedContributors.length;

  const focusedAffiliations = nviCandidate.affiliations.slice(0, 5);
  const countRestAffiliations = nviCandidate.affiliations.length - focusedAffiliations.length;

  const typeString = nviCandidate.publicationDetails.type
    ? t(`registration.publication_types.${nviCandidate.publicationDetails.type}`)
    : '';
  const heading = [typeString, nviCandidate.year].filter(Boolean).join(' — ');

  const myAffiliation = nviCandidate.affiliations.find((affiliation) => affiliation.id === user?.topOrgCristinId);

  return (
    <SearchListItem
      sx={{
        borderLeftColor: 'registration.main',
        gap: '0.5rem',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {heading && (
          <Typography variant="overline" sx={{ color: 'primary.main' }}>
            {heading}
          </Typography>
        )}
        <Typography sx={{ fontSize: '1rem', fontWeight: '600', wordWrap: 'break-word' }}>
          {getTitleString(nviCandidate.publicationDetails.title)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '0.5rem', flexWrap: 'wrap' }}>
          {focusedContributors.map((contributor, index) => (
            <Typography key={index} variant="body2" sx={{ '&:not(:last-child)': { '&:after': { content: '";"' } } }}>
              {contributor.id ? (
                <MuiLink component={Link} to={getResearchProfilePath(contributor.id)}>
                  {contributor.name}
                </MuiLink>
              ) : (
                contributor.name
              )}
            </Typography>
          ))}
          {countRestContributors > 0 && (
            <Typography variant="body2">({t('common.x_others', { count: countRestContributors })})</Typography>
          )}
        </Box>

        {nviCandidate.affiliations.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '0.5rem', flexWrap: 'wrap' }}>
            {focusedAffiliations.map((affiliation) => (
              <Typography key={affiliation.id} sx={{ '&:not(:last-child)': { '&:after': { content: '";"' } } }}>
                {getLanguageString(affiliation.labels)}
              </Typography>
            ))}
            {countRestAffiliations > 0 && (
              <Typography>({t('common.x_others', { count: countRestAffiliations })})</Typography>
            )}
          </Box>
        )}
      </Box>

      {myAffiliation && <Typography>{t(`tasks.nvi.status.${myAffiliation.approvalStatus}`)}</Typography>}
    </SearchListItem>
  );
};
