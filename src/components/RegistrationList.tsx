import CancelIcon from '@mui/icons-material/Cancel';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { Box, IconButton, LinkProps, List, ListItemText, Link as MuiLink, Tooltip, Typography } from '@mui/material';
import { useIsMutating, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router';
import { updatePromotedPublications } from '../api/preferencesApi';
import { setNotification } from '../redux/notificationSlice';
import { RootState } from '../redux/store';
import { PreviousPathLocationState } from '../types/locationState.types';
import { RegistrationSearchItem, RegistrationStatus } from '../types/registration.types';
import { dataTestId } from '../utils/dataTestIds';
import { stringIncludesMathJax, typesetMathJax } from '../utils/mathJaxHelpers';
import { getContributorsWithPrimaryRole, getTitleString } from '../utils/registration-helpers';
import {
  doNotRedirectQueryParam,
  getRegistrationLandingPagePath,
  getRegistrationWizardPath,
  getResearchProfilePath,
  UrlPathTemplate,
} from '../utils/urlPaths';
import { ContributorIndicators } from './ContributorIndicators';
import { ErrorBoundary } from './ErrorBoundary';
import { RegistrationIconHeader } from './RegistrationIconHeader';
import { SearchListItem } from './styled/Wrappers';
import { TruncatableTypography } from './TruncatableTypography';

export interface RegistrationListProps extends Pick<LinkProps, 'target'> {
  registrations: RegistrationSearchItem[];
  canEditRegistration?: boolean;
  onDeleteDraftRegistration?: (registration: RegistrationSearchItem) => void;
  promotedPublications?: string[];
}

export const RegistrationList = ({ registrations, ...rest }: RegistrationListProps) => {
  useEffect(() => {
    if (
      registrations.some(
        ({ mainTitle, abstract }) => stringIncludesMathJax(mainTitle) || stringIncludesMathJax(abstract)
      )
    ) {
      typesetMathJax();
    }
  }, [registrations]);

  return (
    <List data-testid="search-results">
      {registrations.map((registration) => (
        <ErrorBoundary key={registration.id}>
          <SearchListItem>
            <RegistrationListItemContent registration={registration} {...rest} />
          </SearchListItem>
        </ErrorBoundary>
      ))}
    </List>
  );
};

interface RegistrationListItemContentProps extends Omit<RegistrationListProps, 'registrations'> {
  registration: RegistrationSearchItem;
  onRemoveRelated?: () => void;
}

// TODO: Rather than expanding on the complexity of this component, we are currently in a process of using the composition pattern
// to put together several similar but different versions of this component using common building blocks to avoid code duplication.
// What was previously a part of this component using ticketView-boolean-prop has now become the TicketInformation-component.
// If your use case for using this component goes into some of the if-conditionals in this component, please consider
// whether you can create a new component using the composition pattern (see example in TicketInformation) with
// new or existing building blocks (in the RegistrationListItem/components-folder)
export const RegistrationListItemContent = ({
  registration,
  canEditRegistration,
  onDeleteDraftRegistration,
  promotedPublications = [],
  target,
  onRemoveRelated,
}: RegistrationListItemContentProps) => {
  const { t } = useTranslation();
  const { id, identifier } = registration;
  const location = useLocation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const user = useSelector((store: RootState) => store.user);
  const userCristinId = user?.cristinId ?? '';
  const mutationKey = ['person-preferences', userCristinId];

  const registrationType = registration.type;
  const contributors = registration.contributorsPreview ?? [];

  const primaryContributors = registrationType
    ? getContributorsWithPrimaryRole(contributors, registrationType)
    : contributors;

  const focusedContributors = primaryContributors.slice(0, 5);
  const countRestContributors = registration.contributorsCount - focusedContributors.length;

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

  const doNotRedirect =
    (location.pathname === UrlPathTemplate.TasksResultRegistrations ||
      location.pathname === UrlPathTemplate.InstitutionPortfolio) &&
    (registration.recordMetadata.status === RegistrationStatus.Unpublished ||
      registration.recordMetadata.status === RegistrationStatus.Deleted);

  return (
    <Box sx={{ display: 'flex', width: '100%', gap: '1rem' }}>
      <ListItemText disableTypography data-testid={dataTestId.startPage.searchResultItem}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '0.5rem',
            flexWrap: 'wrap',
          }}>
          <RegistrationIconHeader
            publicationInstanceType={registration.type}
            publicationDate={registration.publicationDate}
          />
        </Box>
        <Typography gutterBottom sx={{ fontSize: '1rem', fontWeight: '600', wordBreak: 'break-word' }}>
          <MuiLink
            target={target}
            component={Link}
            state={{ previousPath: `${location.pathname}${location.search}` } satisfies PreviousPathLocationState}
            to={{
              pathname: getRegistrationLandingPagePath(identifier),
              search: doNotRedirect ? `${doNotRedirectQueryParam}=true` : '',
            }}>
            {getTitleString(registration.mainTitle)}
          </MuiLink>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '1rem',
          }}>
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '0.5rem', flexWrap: 'wrap' }}>
            {focusedContributors.map((contributor, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', '&:not(:last-child)': { '&:after': { content: '";"' } } }}>
                <Typography variant="body2">
                  {contributor.identity.id ? (
                    <MuiLink target={target} component={Link} to={getResearchProfilePath(contributor.identity.id)}>
                      {contributor.identity.name}
                    </MuiLink>
                  ) : (
                    contributor.identity.name
                  )}
                </Typography>
                <ContributorIndicators
                  orcId={contributor.identity.orcId}
                  correspondingAuthor={contributor.correspondingAuthor}
                />
              </Box>
            ))}
            {countRestContributors > 0 && (
              <Typography variant="body2">({t('common.x_others', { count: countRestContributors })})</Typography>
            )}
          </Box>
        </Box>

        {(registration.abstract || registration.description) && (
          <TruncatableTypography sx={{ mt: '0.5rem', maxWidth: '60rem' }}>
            {registration.abstract || registration.description}
          </TruncatableTypography>
        )}
      </ListItemText>
      {location.pathname.includes(UrlPathTemplate.ResearchProfileRoot) && isPromotedPublication && (
        <StarIcon color="secondary" fontSize="small" />
      )}
      {canEditRegistration && (
        <Box sx={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
          {location.pathname === UrlPathTemplate.MyPageResults && (
            <IconButton
              title={t('my_page.my_profile.edit_promoted_publication')}
              data-testid={
                isPromotedPublication
                  ? dataTestId.myPage.removePromotedPublicationButton
                  : dataTestId.myPage.addPromotedPublicationButton
              }
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
              sx={{
                bgcolor: isPromotedPublication ? 'secondary.main' : 'tertiary.main',
                width: '1.5rem',
                height: '1.5rem',
              }}>
              {isPromotedPublication ? (
                <StarIcon sx={{ color: 'white' }} fontSize="inherit" />
              ) : (
                <StarOutlineIcon color="primary" fontSize="inherit" />
              )}
            </IconButton>
          )}
          <Tooltip title={t('common.edit')}>
            <IconButton
              component={Link}
              target={target}
              to={getRegistrationWizardPath(identifier)}
              data-testid={`edit-registration-${identifier}`}
              size="small"
              sx={{ bgcolor: 'tertiary.main', width: '1.5rem', height: '1.5rem' }}>
              <EditIcon color="primary" fontSize="inherit" />
            </IconButton>
          </Tooltip>
          {registration.recordMetadata.status === RegistrationStatus.Draft && onDeleteDraftRegistration && (
            <Tooltip title={t('common.delete')}>
              <IconButton
                data-testid={`delete-registration-${identifier}`}
                onClick={() => onDeleteDraftRegistration(registration)}
                size="small"
                sx={{ bgcolor: 'tertiary.main', width: '1.5rem', height: '1.5rem' }}>
                <CloseOutlinedIcon color="primary" fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
      {onRemoveRelated && (
        <Tooltip title={t('registration.resource_type.research_data.remove_relation')}>
          <IconButton
            sx={{ alignSelf: 'start' }}
            onClick={onRemoveRelated}
            data-testid={dataTestId.registrationWizard.resourceType.removeRelationButton(registration.identifier)}>
            <CancelIcon color="primary" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};
