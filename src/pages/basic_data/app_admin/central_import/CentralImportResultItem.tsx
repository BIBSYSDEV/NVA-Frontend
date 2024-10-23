import { Box, Link as MuiLink, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ContributorIndicators } from '../../../../components/ContributorIndicators';
import { SearchListItem } from '../../../../components/styled/Wrappers';
import { ImportCandidateSummary } from '../../../../types/importCandidate.types';
import { PreviousSearchLocationState } from '../../../../types/locationState.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { toDateString, toDateStringWithTime } from '../../../../utils/date-helpers';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { getTitleString } from '../../../../utils/registration-helpers';
import { getLanguageString } from '../../../../utils/translation-helpers';
import { getImportCandidatePath, getResearchProfilePath } from '../../../../utils/urlPaths';
import { ImportCandidateChannelName } from './ImportCandidateChannelName';

interface CentralImportResultItemProps {
  importCandidate: ImportCandidateSummary;
}

export const CentralImportResultItem = ({ importCandidate }: CentralImportResultItemProps) => {
  const { t } = useTranslation();

  const typeString = importCandidate.publicationInstance?.type
    ? t(`registration.publication_types.${importCandidate.publicationInstance.type}`)
    : '';
  const heading = [typeString, importCandidate.publicationYear].filter(Boolean).join(' — ');

  const verifiedContributorCount = importCandidate.totalVerifiedContributors;
  const contributorsCount = importCandidate.totalContributors;

  const importCandidateCreatedDate = new Date(importCandidate.createdDate);

  return (
    <SearchListItem
      sx={{
        borderLeftColor: 'centralImport.main',
        flexDirection: 'row',
        gap: '1rem',
        justifyContent: 'space-between',
      }}
      data-testid={dataTestId.startPage.searchResultItem}>
      <div>
        {heading && (
          <Typography variant="overline" color="primary">
            {heading}
          </Typography>
        )}
        <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordWrap: 'break-word' }}>
          <MuiLink
            component={Link}
            to={{
              pathname: getImportCandidatePath(getIdentifierFromId(importCandidate.id)),
              state: { previousSearch: location.search } satisfies PreviousSearchLocationState,
            }}>
            {getTitleString(importCandidate.mainTitle)}
          </MuiLink>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '0.5rem', flexWrap: 'wrap' }}>
            {importCandidate.contributors.map((contributor, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  '&:not(:last-child)': { '&:after': { content: '";"' } },
                }}>
                <Typography variant="body2">
                  {contributor.identity.id ? (
                    <MuiLink component={Link} to={getResearchProfilePath(contributor.identity.id)}>
                      {contributor.identity.name}
                    </MuiLink>
                  ) : (
                    contributor.identity.name
                  )}
                </Typography>
                <ContributorIndicators contributor={contributor} />
              </Box>
            ))}

            <Typography>
              {t('basic_data.central_import.verified_contributor_count', {
                verifiedContributorCount,
                contributorsCount,
              })}
            </Typography>
          </Box>

          {importCandidate.organizations.length > 0 && (
            <Typography>
              {importCandidate.organizations
                .map((organization) =>
                  organization.type === 'Organization' ? getLanguageString(organization.labels) : organization.name
                )
                .filter(Boolean)
                .join(', ')}
            </Typography>
          )}

          <ImportCandidateChannelName importCandidate={importCandidate} />
        </Box>
      </div>
      <Tooltip title={toDateStringWithTime(importCandidate.createdDate)}>
        <Typography sx={{ whiteSpace: 'nowrap' }}>{toDateString(importCandidate.createdDate)}</Typography>
      </Tooltip>
    </SearchListItem>
  );
};
