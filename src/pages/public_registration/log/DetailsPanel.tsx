import CloseIcon from '@mui/icons-material/Close';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import {
  Box,
  Button,
  CSSProperties,
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
import { useQueries, UseQueryResult } from '@tanstack/react-query';
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

const liStyling: CSSProperties = {
  marginBottom: '1rem',
  marginLeft: 0,
  alignItems: 'center',
  listStyleType: 'none',
};

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
  }) as UseQueryResult<Organization>[];

  const topLevelOrgs = affiliations
    .map((affiliation) => (affiliation.data ? getTopLevelOrganization(affiliation.data) : null))
    .filter(Boolean) as Organization[];
  const institutions = topLevelOrgs.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id));

  const customersData = useFetchCustomers({ enabled: institutions.length > 0, staleTime: 1_800_000 }); // Cache for 30 minutes
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
        <DialogTitle sx={{ mr: '1rem' }}>{t('points_of_contact_for_result')}</DialogTitle>
        <IconButton
          sx={{ position: 'absolute', right: '0.5rem', top: '0.75rem' }}
          title={t('common.close')}
          onClick={() => setOpenModal(false)}
          data-testid={dataTestId.confirmDialog.cancelButton}>
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {institutions.length > 0 && (
            <div>
              <Typography variant="h2" gutterBottom>
                {t('institutions_service_support')}
              </Typography>
              <ul style={{ padding: 0 }}>
                {institutions.map((institution) => {
                  const serviceCenterUri = customers.find(
                    (customer) => customer.cristinId === institution.id
                  )?.serviceCenterUri;

                  return (
                    <li key={institution.id} style={liStyling}>
                      <Typography>{getLanguageString(institution.labels)}</Typography>
                      {serviceCenterUri ? (
                        <OpenInNewLink href={serviceCenterUri}>{serviceCenterUri}</OpenInNewLink>
                      ) : (
                        <Typography fontStyle="italic">{t('no_service_center')} </Typography>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

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
    <li style={liStyling}>
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
