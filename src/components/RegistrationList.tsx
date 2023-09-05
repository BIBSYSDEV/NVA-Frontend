import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { Box, IconButton, List, ListItemText, Link as MuiLink, Tooltip, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { updatePromotedPublications } from '../api/preferencesApi';
import { setNotification } from '../redux/notificationSlice';
import { RootState } from '../redux/store';
import { Registration, RegistrationStatus } from '../types/registration.types';
import { dataTestId } from '../utils/dataTestIds';
import { displayDate } from '../utils/date-helpers';
import { getTitleString } from '../utils/registration-helpers';
import {
  UrlPathTemplate,
  getRegistrationLandingPagePath,
  getRegistrationWizardPath,
  getResearchProfilePath,
} from '../utils/urlPaths';
import { ContributorIndicators } from './ContributorIndicators';
import { ErrorBoundary } from './ErrorBoundary';
import { TruncatableTypography } from './TruncatableTypography';
import { SearchListItem } from './styled/Wrappers';
interface RegistrationListProps {
  registrations: Registration[];
  canEditRegistration?: boolean;
  onDeleteDraftRegistration?: (registration: Registration) => void;
  promotedPublications?: string[];
  refetchPromotedPublications?: () => void;
}

export const RegistrationList = ({
  registrations,
  canEditRegistration = false,
  onDeleteDraftRegistration,
  promotedPublications,
  refetchPromotedPublications,
}: RegistrationListProps) => (
  <List>
    {registrations.map((registration) => (
      <ErrorBoundary key={registration.id}>
        <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
          <RegistrationListItemContent
            onDeleteDraftRegistration={onDeleteDraftRegistration}
            registration={registration}
            canEditRegistration={canEditRegistration}
            promotedPublications={promotedPublications}
            refetchPromotedPublications={refetchPromotedPublications}
          />
        </SearchListItem>
      </ErrorBoundary>
    ))}
  </List>
);

interface RegistrationListItemContentProps {
  registration: Registration;
  ticketView?: boolean;
  canEditRegistration?: boolean;
  onDeleteDraftRegistration?: (registration: Registration) => void;
  promotedPublications?: string[];
  refetchPromotedPublications?: () => void;
}

export const RegistrationListItemContent = ({
  registration,
  ticketView = false,
  canEditRegistration,
  onDeleteDraftRegistration,
  promotedPublications,
  refetchPromotedPublications,
}: RegistrationListItemContentProps) => {
  const { t } = useTranslation();
  const { identifier, entityDescription, id } = registration;
  const location = useLocation();
  const dispatch = useDispatch();

  const user = useSelector((store: RootState) => store.user);

  const contributors = entityDescription?.contributors ?? [];
  const focusedContributors = contributors.slice(0, 5);
  const countRestContributors = contributors.length - focusedContributors.length;

  const typeString = entityDescription?.reference?.publicationInstance?.type
    ? t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)
    : '';

  const publicationDate = displayDate(entityDescription?.publicationDate);
  const heading = [typeString, publicationDate].filter(Boolean).join(' — ');

  const isPromotedPublication = promotedPublications && promotedPublications.includes(id);

  const mutatePromotedPublications = useMutation({
    mutationFn: (newPromotedPublications: string[]) =>
      updatePromotedPublications(user?.cristinId ?? '', newPromotedPublications),
    onSuccess: () => {
      refetchPromotedPublications?.();
      dispatch(setNotification({ message: t('feedback.success.updated_promoted_publication'), variant: 'success' }));
    },
    onError: () =>
      dispatch(setNotification({ message: t('feedback.error.add_promoted_publication'), variant: 'error' })),
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
                {t('registration.public_page.metadata_not_published')}
              </Typography>
            )}
        </Box>
        <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordWrap: 'break-word' }}>
          {ticketView ? (
            getTitleString(entityDescription?.mainTitle)
          ) : (
            <MuiLink component={Link} to={getRegistrationLandingPagePath(identifier)}>
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
                    <MuiLink component={Link} to={getResearchProfilePath(contributor.identity.id)}>
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

        <TruncatableTypography sx={{ mt: '0.5rem', maxWidth: '60rem' }}>
          {entityDescription?.abstract}
        </TruncatableTypography>
      </ListItemText>

      {canEditRegistration && (
        <Box sx={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
          {location.pathname.includes(UrlPathTemplate.MyPageMyResults) && (
            <IconButton
              title={t('my_page.my_profile.add_promoted_publication')}
              data-testid={dataTestId.myPage.addPromotedPublicationButton}
              disabled={mutatePromotedPublications.isLoading}
              onClick={() => {
                if (isPromotedPublication) {
                  mutatePromotedPublications.mutate(
                    promotedPublications.filter((promotedPublicationId) => promotedPublicationId !== id)
                  );
                } else {
                  mutatePromotedPublications.mutate([...(promotedPublications ?? []), id]);
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
              to={getRegistrationWizardPath(identifier)}
              size="small"
              sx={{ bgcolor: 'registration.main', width: '1.5rem', height: '1.5rem' }}>
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Tooltip>
          {registration.status === 'DRAFT' && onDeleteDraftRegistration && (
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
