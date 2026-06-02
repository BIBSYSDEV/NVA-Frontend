import CloseIcon from '@mui/icons-material/Close';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, styled, Typography } from '@mui/material';
import { useQueries } from '@tanstack/react-query';
import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { fetchOrganization } from '../../../../../api/cristinApi';
import { ViewContactInfoButton } from '../../../../../components/_atoms/buttons/ViewContactInfoButton';
import { OpenInNewLink } from '../../../../../components/OpenInNewLink';
import { ConfirmedAffiliation, ContributorRole } from '../../../../../types/contributor.types';
import { Organization } from '../../../../../types/organization.types';
import { Registration } from '../../../../../types/registration.types';
import { dataTestId } from '../../../../../utils/dataTestIds';
import { getTopLevelOrganization, getUniqueOrganizations } from '../../../../../utils/institutions-helpers';
import { ContactPersonRow } from './_components/ContactPersonRow';
import { InstitutionsServiceCenterOverview } from './_components/InstitutionsServiceCenterOverview';

const StyledList = styled('ul')({
  padding: 0,
});

interface PointOfContactProps {
  registration: Registration;
}

export const PointOfContact = ({ registration }: PointOfContactProps) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const contributors = registration.entityDescription?.contributors ?? [];
  const correspondingContributors = contributors.filter((contributor) => contributor.correspondingAuthor);
  const contactPersons = contributors.filter((contributor) => contributor.role?.type === ContributorRole.ContactPerson);

  const confirmedAffiliations = contributors.flatMap((contributor) =>
    contributor.affiliations?.filter((affiliation) => affiliation.type === 'Organization' && affiliation.id)
  ) as ConfirmedAffiliation[];
  const uniqueAffiliations = getUniqueOrganizations(confirmedAffiliations);

  const affiliationQueries = useQueries({
    queries: uniqueAffiliations.map((affiliation) => ({
      queryKey: ['organization', affiliation.id],
      queryFn: () => fetchOrganization(affiliation.id),
      meta: { errorMessage: t('feedback.error.get_institution') },
      staleTime: Infinity,
      gcTime: 1_800_000,
    })),
  });

  const topLevelOrgs = affiliationQueries
    .map((affiliationQuery) => (affiliationQuery.data ? getTopLevelOrganization(affiliationQuery.data) : null))
    .filter(Boolean) as Organization[];
  const uniqueInstitutions = getUniqueOrganizations(topLevelOrgs);

  return (
    <>
      <Typography variant="h3">{t('point_of_contact')}</Typography>
      <Typography>{t('point_of_contact_description')}</Typography>
      <ViewContactInfoButton sx={{ alignSelf: { sm: 'start', md: 'center' } }} onClick={() => setOpenModal(true)} />

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
          {uniqueInstitutions.length > 0 && <InstitutionsServiceCenterOverview institutions={uniqueInstitutions} />}

          {contactPersons.length > 0 && (
            <div>
              <Typography variant="h2" gutterBottom>
                {t('registration.contributors.types.ContactPerson')}
              </Typography>
              <StyledList>
                {contactPersons.map((contributor, index) => (
                  <ContactPersonRow key={index} contributor={contributor} />
                ))}
              </StyledList>
            </div>
          )}
          {correspondingContributors.length > 0 && (
            <div>
              <Typography variant="h2" gutterBottom>
                {t('corresponding_contributor')}
              </Typography>
              <StyledList>
                {correspondingContributors.map((contributor, index) => (
                  <ContactPersonRow key={index} contributor={contributor} />
                ))}
              </StyledList>
            </div>
          )}

          <Divider />

          <Trans
            t={t}
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
    </>
  );
};
