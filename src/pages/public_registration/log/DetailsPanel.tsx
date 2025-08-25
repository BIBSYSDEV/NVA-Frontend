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
import { useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFetchCustomers } from '../../../api/hooks/useFetchCustomers';
import { useFetchPerson } from '../../../api/hooks/useFetchPerson';
import { ContributorName } from '../../../components/ContributorName';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { ConfirmedAffiliation, Contributor, ContributorRole } from '../../../types/contributor.types';
import { Organization } from '../../../types/organization.types';
import { dataTestId } from '../../../utils/dataTestIds';
import { getTopLevelOrganization } from '../../../utils/institutions-helpers';
import { getLanguageString } from '../../../utils/translation-helpers';

interface DetailsPanelProps {
  contributors: Contributor[];
}

export const DetailsPanel = ({ contributors }: DetailsPanelProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const correspondingContributors = contributors.filter((contributor) => contributor.correspondingAuthor);
  const contactPersons = contributors.filter((contributor) => contributor.role.type === ContributorRole.ContactPerson);

  const confirmedAffiliations = contributors.flatMap((contributor) =>
    contributor.affiliations?.filter((affiliation) => affiliation.type === 'Organization' && affiliation.id)
  ) as ConfirmedAffiliation[];

  const affiliations = useQueries({
    queries: confirmedAffiliations.map((affiliation) => ({
      queryKey: ['organization', affiliation.id],
    })),
  });

  const topLevelOrgs = affiliations.map((affiliation) => getTopLevelOrganization(affiliation.data as Organization));
  const unique = topLevelOrgs.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  const customersData = useFetchCustomers(); // TODO: cache?
  const customers = customersData.data?.customers ?? [];

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
        sx={{ alignSelf: { sm: 'start', md: 'center' } }}
        startIcon={<MailOutlineIcon />}
        onClick={() => setOpenModal(true)}>
        {t('view_contact_info')}
      </Button>

      <Dialog
        data-testid={dataTestId.registrationLandingPage.detailsTab.resultContactModal}
        open={openModal}
        maxWidth="md"
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

          <table>
            <thead>
              <tr>
                <th>Bidragsytere sine tilknytninger</th>
                <th>Institusjonens brukerstøtte</th>
              </tr>
            </thead>
            <tbody>
              {unique.map((org) => {
                const serviceCenterUri = customers.find((customer) => customer.cristinId === org.id)?.serviceCenterUri;
                return (
                  <tr key={org.id}>
                    <td>{getLanguageString(org.labels)}</td>
                    <td>
                      {serviceCenterUri && <OpenInNewLink href={serviceCenterUri}>{serviceCenterUri}</OpenInNewLink>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

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
