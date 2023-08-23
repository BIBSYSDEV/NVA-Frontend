import { Box, ListItemText, Link as MuiLink, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ContributorIndicators } from '../../../../components/ContributorIndicators';
import { SearchListItem } from '../../../../components/styled/Wrappers';
import { ImportCandidateSummary } from '../../../../types/importCandidate.types';
import { dataTestId } from '../../../../utils/dataTestIds';
import { getIdentifierFromId } from '../../../../utils/general-helpers';
import { getTitleString } from '../../../../utils/registration-helpers';
import { getDuplicateCheckPagePath, getResearchProfilePath } from '../../../../utils/urlPaths';

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

  return (
    <SearchListItem sx={{ borderLeftColor: 'centralImport.main', display: 'flex', width: '100%', gap: '1rem' }}>
      <ListItemText disableTypography data-testid={dataTestId.startPage.searchResultItem}>
        {heading && (
          <Typography variant="overline" sx={{ color: 'primary.main' }}>
            {heading}
          </Typography>
        )}
        <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordWrap: 'break-word' }}>
          <MuiLink component={Link} to={getDuplicateCheckPagePath(getIdentifierFromId(importCandidate.id))}>
            {getTitleString(importCandidate.mainTitle)}
          </MuiLink>
        </Typography>
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
      </ListItemText>
    </SearchListItem>
  );
};
