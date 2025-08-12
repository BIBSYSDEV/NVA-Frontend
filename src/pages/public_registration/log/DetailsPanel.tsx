import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { Box, Button, Divider, Link, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { Modal } from '../../../components/Modal';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { Contributor, ContributorRole } from '../../../types/contributor.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { ContributorName } from '../../../components/ContributorName';

interface DetailsPanelProps {
  contributors: Contributor[];
}

export const DetailsPanel = ({ contributors }: DetailsPanelProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

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
      <Modal
        data-testid={dataTestId.registrationLandingPage.detailsTab.resultContactModal}
        open={openModal}
        onClose={() => setOpenModal(false)}
        headingText={t('points_of_contact_for_result')}
        maxWidth="sm">
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Typography variant="h2">Kontaktperson</Typography>
          {contributors
            .filter((contributor) => contributor.role.type === ContributorRole.ContactPerson)
            .map((contributor, index) => (
              <ContactPersonRow key={index} contributor={contributor} />
            ))}
          <Typography variant="h2">Korresponderende forfatter</Typography>
          {contributors
            .filter((contributor) => contributor.correspondingAuthor === true)
            .map((contributor, index) => (
              <ContactPersonRow key={index} contributor={contributor} />
            ))}
          <Divider />
          <Trans
            i18nKey="default_point_of_contact"
            components={{
              p: <Typography />,
              link1: (
                <OpenInNewLink
                  data-testid={dataTestId.registrationLandingPage.detailsTab.infoLink}
                  href="https://sikt.no/kontakt-oss"
                />
              ),
            }}
          />
        </Box>
      </Modal>
    </Box>
  );
};

interface ContactPersonRowProps {
  contributor: Contributor;
}

const ContactPersonRow = ({ contributor }: ContactPersonRowProps) => {
  const personQuery = useFetchPerson(contributor.identity.id ?? '');
  const person = personQuery.data;

  return (
    <span style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <ContributorName
        id={contributor.identity.id}
        name={contributor.identity.name}
        hasVerifiedAffiliation={
          !!contributor.affiliations &&
          contributor.affiliations?.some((affiliation) => affiliation.type === 'Organization')
        }
      />
      {person?.contactDetails?.email && (
        <Box sx={{ display: 'flex', gap: '0.5rem' }}>
          <MailOutlineIcon />
          <Link href={`mailto:${person.contactDetails.email}`}>{person.contactDetails.email}</Link>
        </Box>
      )}
    </span>
  );
};
