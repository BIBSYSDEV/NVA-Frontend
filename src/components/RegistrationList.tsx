import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Box, Link as MuiLink, List, ListItemText, Typography, IconButton } from '@mui/material';
import { getRegistrationLandingPagePath, getRegistrationWizardPath, getResearchProfilePath } from '../utils/urlPaths';
import { Registration, RegistrationStatus } from '../types/registration.types';
import { ErrorBoundary } from './ErrorBoundary';
import { dataTestId } from '../utils/dataTestIds';
import { getTitleString } from '../utils/registration-helpers';
import { displayDate } from '../utils/date-helpers';
import { TruncatableTypography } from './TruncatableTypography';
import { ContributorIndicators } from './ContributorIndicators';
import { SearchListItem } from './styled/Wrappers';
import EditIcon from '@mui/icons-material/Edit';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';
import { deleteRegistration } from '../api/registrationApi';
import { setNotification } from '../redux/notificationSlice';
import { isErrorStatus, isSuccessStatus } from '../utils/constants';
import { getIdentifierFromId } from '../utils/general-helpers';
import { useDispatch } from 'react-redux';

interface RegistrationListProps {
  registrations: Registration[];
  canEditRegistration?: boolean;
  refetchRegistrations?: () => void;
}

export const RegistrationList = ({
  registrations,
  canEditRegistration = false,
  refetchRegistrations,
}: RegistrationListProps) => (
  <List disablePadding>
    {registrations.map((registration) => (
      <ErrorBoundary key={registration.id}>
        <SearchListItem sx={{ borderLeftColor: 'registration.main' }}>
          <RegistrationListItemContent
            registration={registration}
            canEditRegistration={canEditRegistration}
            refetchRegistrations={refetchRegistrations}
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
  refetchRegistrations?: () => void;
}

export const RegistrationListItemContent = ({
  registration,
  ticketView = false,
  canEditRegistration,
  refetchRegistrations,
}: RegistrationListItemContentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { identifier, entityDescription } = registration;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [registrationToDelete, setRegistrationToDelete] = useState<Registration>();
  const [isDeleting, setIsDeleting] = useState(false);

  const contributors = entityDescription?.contributors ?? [];
  const focusedContributors = contributors.slice(0, 5);
  const countRestContributors = contributors.length - focusedContributors.length;

  const typeString = entityDescription?.reference?.publicationInstance?.type
    ? t(`registration.publication_types.${entityDescription.reference.publicationInstance.type}`)
    : '';

  const publicationDate = displayDate(entityDescription?.publicationDate);
  const heading = [typeString, publicationDate].filter(Boolean).join(' — ');

  const deleteDraftRegistration = async () => {
    if (!registrationToDelete) {
      return;
    }
    const identifierToDelete = getIdentifierFromId(registrationToDelete.id);
    setIsDeleting(true);
    const deleteRegistrationResponse = await deleteRegistration(identifierToDelete);
    if (isErrorStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.error.delete_registration'), variant: 'error' }));
      setIsDeleting(false);
    } else if (isSuccessStatus(deleteRegistrationResponse.status)) {
      dispatch(setNotification({ message: t('feedback.success.delete_registration'), variant: 'success' }));
      refetchRegistrations && refetchRegistrations();
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
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
          <Box sx={{ display: 'flex', alignItems: 'center', columnGap: '1rem', flexWrap: 'wrap' }}>
            {focusedContributors.map((contributor, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
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
        <>
          <Box sx={{ display: 'flex', alignItems: 'start', justifySelf: 'end', gap: '0.5rem' }}>
            <IconButton
              component={Link}
              to={getRegistrationWizardPath(identifier)}
              size="small"
              sx={{ borderRadius: '50%', bgcolor: 'registration.main' }}>
              <EditIcon />
            </IconButton>
            {registration.status === 'DRAFT' && (
              <IconButton
                data-testid={`delete-registration-${identifier}`}
                onClick={() => {
                  setRegistrationToDelete(registration);
                  setShowDeleteModal(true);
                }}
                size="small"
                sx={{ borderRadius: '50%', bgcolor: 'registration.main' }}>
                <CloseOutlinedIcon />
              </IconButton>
            )}
          </Box>
          <ConfirmDialog
            open={!!showDeleteModal}
            title={t('my_page.registrations.delete_registration')}
            onAccept={deleteDraftRegistration}
            onCancel={() => {
              setShowDeleteModal(false);
            }}
            isLoading={isDeleting}
            dialogDataTestId="confirm-delete-dialog">
            <Typography>
              {t('my_page.registrations.delete_registration_message', {
                title: getTitleString(registrationToDelete?.entityDescription?.mainTitle),
              })}
            </Typography>
          </ConfirmDialog>
        </>
      )}
    </Box>
  );
};
