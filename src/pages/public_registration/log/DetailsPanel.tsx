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
  const correspondingAuthors = contributors.filter((contributor) => contributor.correspondingAuthor) ?? [];
  const contactPersons =
    contributors.filter((contributor) => contributor.role.type === ContributorRole.ContactPerson) ?? [];

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <DialogTitle>{t('points_of_contact_for_result')}</DialogTitle>
          <IconButton
            title={t('common.close')}
            onClick={() => setOpenModal(false)}
            data-testid={dataTestId.confirmDialog.cancelButton}>
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem', pt: 0 }}>
          {contactPersons.length > 0 && (
            <div>
              <Typography variant="h2" gutterBottom>
                {t('registration.contributors.types.ContactPerson')}
              </Typography>
              {contactPersons.map((contributor, index) => (
                <ContactPersonRow key={index} contributor={contributor} />
              ))}
            </div>
          )}
          {correspondingAuthors.length > 0 && (
            <div>
              <Typography variant="h2" gutterBottom>
                {t('corresponding_author')}
              </Typography>
              {correspondingAuthors.map((contributor, index) => (
                <ContactPersonRow key={index} contributor={contributor} />
              ))}
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
    <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '0.5rem' }}>
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
              !!contributor.affiliations &&
              contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
            }
          />
          {person?.contactDetails?.email && (
            <Box sx={{ display: 'flex', gap: '0.5rem' }}>
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
    </span>
  );
};
