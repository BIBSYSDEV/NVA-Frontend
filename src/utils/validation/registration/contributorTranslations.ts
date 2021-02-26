import i18n from '../../../translations/i18n';
import { ContributorRole } from '../../../types/contributor.types';

export const getAddContributorText = (contributorRole: ContributorRole) => {
  switch (contributorRole) {
    case ContributorRole.EDITOR:
      return i18n.t('registration:contributors.add_editor');
    case ContributorRole.SUPERVISOR:
      return i18n.t('registration:contributors.add_supervisor');
    default:
      return i18n.t('registration:contributors.add_author');
  }
};

export const getContributorHeading = (contributorRole: ContributorRole) => {
  switch (contributorRole) {
    case ContributorRole.EDITOR:
      return i18n.t('contributors.editors');
    case ContributorRole.SUPERVISOR:
      return i18n.t('contributors.supervisors');
    default:
      return i18n.t('contributors.authors');
  }
};
