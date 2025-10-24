import { Typography } from '@mui/material';
import { HorizontalBox } from '../../styled/Wrappers';
import { ContributorIndicators } from '../../ContributorIndicators';
import { getContributorsWithPrimaryRole } from '../../../utils/registration-helpers';
import { useTranslation } from 'react-i18next';
import { RegistrationListItemContext } from '../context';
import { useContext } from 'react';

interface ContributorsProps {
  ticketView?: boolean;
}

export const Contributors = ({ ticketView = true }: ContributorsProps) => {
  const { t } = useTranslation();
  const { registration } = useContext(RegistrationListItemContext) ?? {};
  if (!registration) return null;
  const { contributorsPreview: contributors = [], type: registrationType, contributorsCount = 0 } = registration;

  const primaryContributors = registrationType
    ? getContributorsWithPrimaryRole(contributors, registrationType)
    : contributors;
  const focusedContributors = primaryContributors.slice(0, 5);
  const countRestContributors = contributorsCount - focusedContributors.length;

  return (
    <HorizontalBox sx={{ columnGap: '0.5rem', flexWrap: 'wrap' }}>
      {focusedContributors.map((contributor, index) => (
        <HorizontalBox key={index} sx={{ '&:not(:last-child)': { '&:after': { content: '";"' } } }}>
          <Typography variant="body2">{contributor.identity.name}</Typography>
          <ContributorIndicators
            orcId={contributor.identity.orcId}
            correspondingAuthor={contributor.correspondingAuthor}
            ticketView={ticketView}
          />
        </HorizontalBox>
      ))}
      {countRestContributors > 0 && (
        <Typography variant="body2">({t('common.x_others', { count: countRestContributors })})</Typography>
      )}
    </HorizontalBox>
  );
};
