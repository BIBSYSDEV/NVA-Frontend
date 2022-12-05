import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Box,
  Link as MuiLink,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { getRegistrationLandingPagePath, getResearchProfilePath } from '../utils/urlPaths';
import { Registration } from '../types/registration.types';
import { ErrorBoundary } from './ErrorBoundary';
import { dataTestId } from '../utils/dataTestIds';
import { getTitleString } from '../utils/registration-helpers';

interface RegistrationListProps {
  registrations: Registration[];
}

export const RegistrationList = ({ registrations }: RegistrationListProps) => {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper}>
      <Table>
        <caption style={visuallyHidden}>{t('common.registrations')}</caption>
        <TableHead sx={{ fontSize: 400 }}>
          <TableRow>
            <TableCell width={1}>{t('registration.resource_type.resource_type')}</TableCell>
            <TableCell width={1}>{t('common.year')}</TableCell>
            <TableCell>{t('search.title_and_contributors')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {registrations.map((registration) => {
            const { id, identifier, entityDescription } = registration;
            const contributors = entityDescription?.contributors ?? [];
            const focusedContributors = contributors.slice(0, 5);
            const countRestContributors = contributors.length - focusedContributors.length;
            return (
              <TableRow key={id} data-testid={dataTestId.startPage.searchResultItem}>
                <ErrorBoundary>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {entityDescription?.reference?.publicationInstance.type &&
                      t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)}
                  </TableCell>
                  <TableCell>{entityDescription?.date?.year}</TableCell>
                  <TableCell>
                    <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600' }}>
                      <MuiLink component={Link} to={getRegistrationLandingPagePath(identifier)}>
                        {getTitleString(entityDescription?.mainTitle)}
                      </MuiLink>
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        columnGap: '1rem',
                        whiteSpace: 'nowrap',
                      }}>
                      {focusedContributors.map((contributor, index) => (
                        <Typography key={index} variant="body2">
                          {contributor.identity.id ? (
                            <MuiLink component={Link} to={getResearchProfilePath(contributor.identity.id)}>
                              {contributor.identity.name}
                            </MuiLink>
                          ) : (
                            contributor.identity.name
                          )}
                        </Typography>
                      ))}
                      {countRestContributors > 0 && (
                        <Typography variant="body2">
                          ({t('common.x_others', { count: countRestContributors })})
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                </ErrorBoundary>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
