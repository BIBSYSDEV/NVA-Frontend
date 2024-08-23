import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { Box, IconButton, Link as MuiLink, LinkProps, List, ListItemText, Tooltip, Typography } from '@mui/material';
import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { updatePromotedPublications } from '../api/preferencesApi';
import { setNotification } from '../redux/notificationSlice';
import { RootState } from '../redux/store';
import { PreviousPathLocationState } from '../types/locationState.types';
import { Registration, RegistrationStatus } from '../types/registration.types';
import { dataTestId } from '../utils/dataTestIds';
import { displayDate } from '../utils/date-helpers';
import {
  getContributorsWithPrimaryRole,
  getTitleString,
  userCanDeleteRegistration,
} from '../utils/registration-helpers';
import {
  getRegistrationLandingPagePath,
  getRegistrationWizardPath,
  getResearchProfilePath,
  UrlPathTemplate,
} from '../utils/urlPaths';
import { ContributorIndicators } from './ContributorIndicators';
import { ErrorBoundary } from './ErrorBoundary';
import { SearchListItem } from './styled/Wrappers';
import { TruncatableTypography } from './TruncatableTypography';

interface RegistrationListProps extends Pick<LinkProps, 'target'> {
  registrations: Registration[];
  canEditRegistration?: boolean;
  onDeleteDraftRegistration?: (registration: Registration) => void;
  promotedPublications?: string[];
}

export const RegistrationList = ({ registrations, ...rest }: RegistrationListProps) => (
  <List data-testid="search-results">
    {registrations.map((registration) => (
      <ErrorBoundary key={registration.id}>
        <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
          <RegistrationListItemContent registration={registration} {...rest} />
        </SearchListItem>
      </ErrorBoundary>
    ))}
  </List>
);

interface RegistrationListItemContentProps extends Omit<RegistrationListProps, 'registrations'> {
  registration: Registration;
  ticketView?: boolean;
}

export const RegistrationListItemContent = ({
  registration,
  ticketView = false,
  canEditRegistration,
  onDeleteDraftRegistration,
  promotedPublications = [],
  target,
}: RegistrationListItemContentProps) => {
  const { t } = useTranslation();
  const { identifier, entityDescription, id } = registration;
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId ?? '';
  const mutationKey = ['person-preferences', userCristinId];

  const registrationType = entityDescription?.reference?.publicationInstance?.type;
  const contributors = entityDescription?.contributors ?? [];

  const primaryContributors = registrationType
    ? getContributorsWithPrimaryRole(contributors, registrationType)
    : contributors;

  const focusedContributors = primaryContributors.slice(0, 5);
  const countRestContributors = primaryContributors.length - focusedContributors.length;

  const typeString = registrationType ? t(`registration.publication_types.${registrationType}`) : '';

  const publicationDate = displayDate(entityDescription?.publicationDate);
  const heading = [typeString, publicationDate].filter(Boolean).join(' — ');

  const isPromotedPublication = promotedPublications.includes(id);

  const isMutating = useIsMutating({ mutationKey }) > 0;

  const mutatePromotedPublications = useMutation({
    mutationKey,
    mutationFn: (newPromotedPublications: string[]) =>
      updatePromotedPublications(userCristinId, newPromotedPublications),
    onSuccess: (newData) => {
      queryClient.setQueryData(mutationKey, newData);
      dispatch(setNotification({ message: t('feedback.success.update_promoted_publication'), variant: 'success' }));
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.update_promoted_publication'), variant: 'error' })),
  });

  return (
    <Box sx={{ display: 'flex', width: '100%', gap: '1rem' }}>
      <ListItemText disableTypography data-testid={dataTestId.startPage.searchResultItem}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: '1rem', sm: '2rem' } }}>
          {heading && (
            <Typography variant="overline" sx={{ color: 'primary.main' }}>
              {heading}
            </Typography>
          )}

          {ticketView &&
            (registration.status === RegistrationStatus.Draft || registration.status === RegistrationStatus.New) && (
              <Typography
                sx={{
                  p: '0.1rem 0.75rem',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}>
                {t('registration.public_page.result_not_published')}
              </Typography>
            )}
        </Box>
        <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordBreak: 'break-word' }}>
          {ticketView ? (
            getTitleString(entityDescription?.mainTitle)
          ) : (
            <MuiLink
              target={target}
              component={Link}
              to={{
                pathname: getRegistrationLandingPagePath(identifier),
                state: { previousPath: `${location.pathname}${location.search}` } satisfies PreviousPathLocationState,
              }}>
              {getTitleString(entityDescription?.mainTitle)}
            </MuiLink>
          )}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '1rem',
            whiteSpace: 'nowrap',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '0.5rem', flexWrap: 'wrap' }}>
            {focusedContributors.map((contributor, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', '&:not(:last-child)': { '&:after': { content: '";"' } } }}>
                <Typography variant="body2">
                  {contributor.identity.id && !ticketView ? (
                    <MuiLink target={target} component={Link} to={getResearchProfilePath(contributor.identity.id)}>
                      {contributor.identity.name}
                    </MuiLink>
                  ) : (
                    contributor.identity.name
                  )}
                </Typography>
                <ContributorIndicators contributor={contributor} ticketView={ticketView} />
              </Box>
            ))}
            {countRestContributors > 0 && (
              <Typography variant="body2">({t('common.x_others', { count: countRestContributors })})</Typography>
            )}
          </Box>
        </Box>

        {(entityDescription?.abstract || entityDescription?.description) && (
          <TruncatableTypography sx={{ mt: '0.5rem', maxWidth: '60rem' }}>
            {entityDescription?.abstract || entityDescription?.description}
          </TruncatableTypography>
        )}
      </ListItemText>

      {location.pathname.includes(UrlPathTemplate.ResearchProfile) && isPromotedPublication && (
        <StarIcon fontSize="small" />
      )}

      {canEditRegistration && (
        <Box sx={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
          {location.pathname === UrlPathTemplate.MyPageResults && (
            <IconButton
              title={t('my_page.my_profile.edit_promoted_publication')}
              data-testid={dataTestId.myPage.addPromotedPublicationButton}
              disabled={isMutating}
              onClick={() => {
                if (isPromotedPublication) {
                  mutatePromotedPublications.mutate(
                    promotedPublications.filter((promotedPublicationId) => promotedPublicationId !== id)
                  );
                } else {
                  mutatePromotedPublications.mutate([...promotedPublications, id]);
                }
              }}
              size="small"
              sx={{ bgcolor: 'registration.main', width: '1.5rem', height: '1.5rem' }}>
              {isPromotedPublication ? <StarIcon fontSize="inherit" /> : <StarOutlineIcon fontSize="inherit" />}
            </IconButton>
          )}
          <Tooltip title={t('common.edit')}>
            <IconButton
              data-testid={`edit-registration-${identifier}`}
              component={Link}
              target={target}
              to={getRegistrationWizardPath(identifier)}
              size="small"
              sx={{ bgcolor: 'registration.main', width: '1.5rem', height: '1.5rem' }}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          {registration.status === 'DRAFT' && onDeleteDraftRegistration && userCanDeleteRegistration(registration) && (
            <Tooltip title={t('common.delete')}>
              <IconButton
                data-testid={`delete-registration-${identifier}`}
                onClick={() => onDeleteDraftRegistration(registration)}
                size="small"
                sx={{ bgcolor: 'registration.main', width: '1.5rem', height: '1.5rem' }}>
                <CloseOutlinedIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  );
};
