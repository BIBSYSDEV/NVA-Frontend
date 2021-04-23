import i18n from '../../../translations/i18n';
import { ContributorRole } from '../../../types/contributor.types';

export const getAddContributorText = (contributorRole: string) => {
  switch (contributorRole) {
    case ContributorRole.Creator:
      return i18n.t('registration:contributors.add_author');
    case ContributorRole.Editor:
      return i18n.t('registration:contributors.add_editor');
    case ContributorRole.Supervisor:
      return i18n.t('registration:contributors.add_supervisor');
    default:
      return i18n.t('registration:contributors.add_contributor');
  }
};

export const getContributorHeading = (contributorRole: string) => {
  switch (contributorRole) {
    case ContributorRole.Creator:
      return i18n.t('registration:contributors.authors');
    case ContributorRole.Editor:
      return i18n.t('registration:contributors.editors');
    case ContributorRole.Supervisor:
      return i18n.t('registration:contributors.supervisors');
    default:
      return i18n.t('registration:heading.contributors');
  }
};

export const getRemoveContributorText = (contributorRole: string) => {
  switch (contributorRole) {
    case ContributorRole.Creator:
      return i18n.t('registration:contributors.remove_author');
    case ContributorRole.Editor:
      return i18n.t('registration:contributors.remove_editor');
    case ContributorRole.Supervisor:
      return i18n.t('registration:contributors.remove_supervisor');
    default:
      return i18n.t('registration:contributors.remove_contributor');
  }
};

export const getAddSelfAsContributorText = (contributorRole: string) => {
  switch (contributorRole) {
    case ContributorRole.Creator:
      return i18n.t('registration:contributors.add_self_as_author');
    case ContributorRole.Editor:
      return i18n.t('registration:contributors.add_self_as_editor');
    case ContributorRole.Supervisor:
      return i18n.t('registration:contributors.add_self_as_supervisor');
    default:
      return i18n.t('registration:contributors.add_self_as_contributor');
  }
};

export const getCreateContributorText = (contributorRole: string) => {
  switch (contributorRole) {
    case ContributorRole.Creator:
      return i18n.t('registration:contributors.create_new_author');
    case ContributorRole.Editor:
      return i18n.t('registration:contributors.create_new_editor');
    case ContributorRole.Supervisor:
      return i18n.t('registration:contributors.create_new_supervisor');
    default:
      return i18n.t('registration:contributors.create_new_contributor');
  }
};
