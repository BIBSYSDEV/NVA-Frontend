import i18n from '../translations/i18n';
import { LanguageString } from '../types/common.types';
import { ContributorRole } from '../types/contributor.types';
import { LanguageCodes } from '../types/language.types';

// Map from three letter language to two ("nob" -> "no")
export const getPreferredLanguageCode = (language?: string) => {
  const currentLanguage = language || i18n.language;
  if (currentLanguage === LanguageCodes.NORWEGIAN_BOKMAL || currentLanguage === LanguageCodes.NORWEGIAN_NYNORSK) {
    return 'nb';
  } else {
    return 'en';
  }
};

// Get label based on selected language
export const getLanguageString = (labels: LanguageString) => {
  const preferredLanguageCode = getPreferredLanguageCode();
  if (Object.keys(labels).includes(preferredLanguageCode)) {
    return labels[preferredLanguageCode];
  }
  return Object.values(labels)[0];
};

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
