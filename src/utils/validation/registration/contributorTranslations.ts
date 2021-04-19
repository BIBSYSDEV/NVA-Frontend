import i18n from '../../../translations/i18n';
import { ContributorRole } from '../../../types/contributor.types';

export const getAddContributorText = (contributorRole: ContributorRole | string) => {
  switch (contributorRole) {
    case ContributorRole.CREATOR:
      return i18n.t('registration:contributors.add_author');
    case ContributorRole.EDITOR:
      return i18n.t('registration:contributors.add_editor');
    case ContributorRole.SUPERVISOR:
      return i18n.t('registration:contributors.add_supervisor');
    default:
      return i18n.t('registration:contributors.add_contributor');
  }
};

export const getContributorHeading = (contributorRole: ContributorRole | string) => {
  switch (contributorRole) {
    case ContributorRole.CREATOR:
      return i18n.t('registration:contributors.authors');
    case ContributorRole.EDITOR:
      return i18n.t('registration:contributors.editors');
    case ContributorRole.SUPERVISOR:
      return i18n.t('registration:contributors.supervisors');
    default:
      return i18n.t('registration:heading.contributors');
  }
};

export const getRemoveContributorText = (contributorRole: ContributorRole | string) => {
  switch (contributorRole) {
    case ContributorRole.CREATOR:
      return i18n.t('registration:contributors.remove_author');
    case ContributorRole.EDITOR:
      return i18n.t('registration:contributors.remove_editor');
    case ContributorRole.SUPERVISOR:
      return i18n.t('registration:contributors.remove_supervisor');
    default:
      return i18n.t('registration:contributors.remove_contributor');
  }
};

export const getAddSelfAsContributorText = (contributorRole: ContributorRole | string) => {
  switch (contributorRole) {
    case ContributorRole.CREATOR:
      return i18n.t('registration:contributors.add_self_as_author');
    case ContributorRole.EDITOR:
      return i18n.t('registration:contributors.add_self_as_editor');
    case ContributorRole.SUPERVISOR:
      return i18n.t('registration:contributors.add_supervisor');
    default:
      return i18n.t('registration:contributors.add_self_as_contributor'); //tom?
  }
};
