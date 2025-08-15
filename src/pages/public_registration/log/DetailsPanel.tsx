import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Skeleton,
  Typography,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { ContributorName } from '../../../components/ContributorName';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface DetailsPanelProps {
  contributors: Contributor[];
}

export const DetailsPanel = ({ contributors }: DetailsPanelProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const correspondingContributors = contributors.filter((contributor) => contributor.correspondingAuthor);
  const contactPersons = contributors.filter((contributor) => contributor.role.type === ContributorRole.ContactPerson);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '1rem',
        bgcolor: 'secondary.main',
        gap: '0.5rem',
      }}>
      <Typography variant="h2" sx={visuallyHidden}>
        {t('details')}
      </Typography>
      <Typography variant="h3">{t('point_of_contact')}</Typography>
      <Typography>{t('point_of_contact_description')}</Typography>
      <Button
        data-testid={dataTestId.registrationLandingPage.detailsTab.viewContactInformationButton}
        variant="contained"
        sx={{ textTransform: 'none', alignSelf: { sm: 'start', md: 'center' } }}
        startIcon={<MailOutlineIcon />}
        onClick={() => setOpenModal(true)}>
        {t('view_contact_info')}
      </Button>

      <Dialog
        data-testid={dataTestId.registrationLandingPage.detailsTab.resultContactModal}
        open={openModal}
        onClose={() => setOpenModal(false)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle>{t('points_of_contact_for_result')}</DialogTitle>
          <IconButton
            sx={{ mr: '1rem', height: 'fit-content' }}
            title={t('common.close')}
            onClick={() => setOpenModal(false)}
            data-testid={dataTestId.confirmDialog.cancelButton}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {contactPersons.length > 0 && (
            <div>
              <Typography variant="h2" gutterBottom>
                {t('registration.contributors.types.ContactPerson')}
              </Typography>
              <ul style={{ padding: 0 }}>
                {contactPersons.map((contributor, index) => (
                  <ContactPersonRow key={index} contributor={contributor} />
                ))}
              </ul>
            </div>
          )}
          {correspondingContributors.length > 0 && (
            <div>
              <Typography variant="h2" gutterBottom>
                {t('corresponding_contributor')}
              </Typography>
              <ul style={{ padding: 0 }}>
                {correspondingContributors.map((contributor, index) => (
                  <ContactPersonRow key={index} contributor={contributor} />
                ))}
              </ul>
            </div>
          )}

          <Divider />

          <Trans
            i18nKey="default_point_of_contact"
            components={{
              p: <Typography gutterBottom />,
              link1: (
                <OpenInNewLink
                  data-testid={dataTestId.registrationLandingPage.detailsTab.infoLink}
                  href="https://sikt.no/kontakt-oss"
                />
              ),
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

interface ContactPersonRowProps {
  contributor: Contributor;
}

const ContactPersonRow = ({ contributor }: ContactPersonRowProps) => {
  const id = contributor.identity.id ?? '';
  const personQuery = useFetchPerson(id);
  const person = personQuery.data;

  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        marginBottom: '0.5rem',
        marginLeft: 0,
        alignItems: 'center',
      }}>
      {personQuery.isFetching ? (
        <>
          <Skeleton width="10rem" />
          <Skeleton width="10rem" />
        </>
      ) : (
        <>
          <ContributorName
            id={id}
            name={contributor.identity.name}
            hasVerifiedAffiliation={
              !!contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
            }
          />
          {person?.contactDetails?.email && (
            <Box sx={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <MailOutlineIcon />
              <Link
                data-testid={dataTestId.registrationLandingPage.detailsTab.emailLink(id)}
                href={`mailto:${person.contactDetails.email}`}>
                {person.contactDetails.email}
              </Link>
            </Box>
          )}
        </>
      )}
    </li>
  );
};
