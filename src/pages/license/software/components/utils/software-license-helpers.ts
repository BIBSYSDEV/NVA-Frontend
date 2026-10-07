import i18n from '../../../../../translations/i18n';

/**
 * A guidance point on a software license deed page, taken from choosealicense.com (CC BY 3.0).
 * The English original term is kept alongside the Norwegian one so readers can compare with the
 * legally binding license text.
 */
export enum LicenseRule {
  CommercialUse = 'CommercialUse',
  Modification = 'Modification',
  Distribution = 'Distribution',
  PrivateUse = 'PrivateUse',
  LicenseAndCopyrightNotice = 'LicenseAndCopyrightNotice',
  Liability = 'Liability',
  Warranty = 'Warranty',
}

interface LicenseRuleText {
  name: string;
  /** English term from the license text, rendered in italics for legal comparison. */
  originalTerm: string;
  description: string;
}

export const licenseRuleTexts: Record<LicenseRule, LicenseRuleText> = {
  [LicenseRule.CommercialUse]: {
    name: i18n.t('licenses.software.rules.commercial_use.name'),
    originalTerm: i18n.t('licenses.software.rules.commercial_use.original_term'),
    description: i18n.t('licenses.software.rules.commercial_use.description'),
  },
  [LicenseRule.Modification]: {
    name: i18n.t('licenses.software.rules.modification.name'),
    originalTerm: i18n.t('licenses.software.rules.modification.original_term'),
    description: i18n.t('licenses.software.rules.modification.description'),
  },
  [LicenseRule.Distribution]: {
    name: i18n.t('licenses.software.rules.distribution.name'),
    originalTerm: i18n.t('licenses.software.rules.distribution.original_term'),
    description: i18n.t('licenses.software.rules.distribution.description'),
  },
  [LicenseRule.PrivateUse]: {
    name: i18n.t('licenses.software.rules.private_use.name'),
    originalTerm: i18n.t('licenses.software.rules.private_use.original_term'),
    description: i18n.t('licenses.software.rules.private_use.description'),
  },
  [LicenseRule.LicenseAndCopyrightNotice]: {
    name: i18n.t('licenses.software.rules.license_and_copyright_notice.name'),
    originalTerm: i18n.t('licenses.software.rules.license_and_copyright_notice.original_term'),
    description: i18n.t('licenses.software.rules.license_and_copyright_notice.description'),
  },
  [LicenseRule.Liability]: {
    name: i18n.t('licenses.software.rules.liability.name'),
    originalTerm: i18n.t('licenses.software.rules.liability.original_term'),
    description: i18n.t('licenses.software.rules.liability.description'),
  },
  [LicenseRule.Warranty]: {
    name: i18n.t('licenses.software.rules.warranty.name'),
    originalTerm: i18n.t('licenses.software.rules.warranty.original_term'),
    description: i18n.t('licenses.software.rules.warranty.description'),
  },
};

export interface SoftwareLicenseDeed {
  /** SPDX identifier of the license the page describes. Also the value of the route param. */
  spdxId: string;
  /** Publisher of the legally binding English license text, e.g. 'opensource.org (OSI)'. */
  officialTextPublisher: string;
  officialTextUrl: string;
  permissions: LicenseRule[];
  conditions: LicenseRule[];
  limitations: LicenseRule[];
  /** Short plain-language summary of what makes this license distinct. */
  summary: string;
  /** Explains the difference between the -or-later and -only variants. Only used by the GPL family. */
  versionNote?: string;
}

const softwareLicenseDeeds: SoftwareLicenseDeed[] = [
  {
    spdxId: 'MIT',
    officialTextPublisher: 'opensource.org (OSI)',
    officialTextUrl: 'https://opensource.org/license/mit',
    permissions: [
      LicenseRule.CommercialUse,
      LicenseRule.Modification,
      LicenseRule.Distribution,
      LicenseRule.PrivateUse,
    ],
    conditions: [LicenseRule.LicenseAndCopyrightNotice],
    limitations: [LicenseRule.Liability, LicenseRule.Warranty],
    summary: i18n.t('licenses.software.summary.mit'),
  },
];

/**
 * Finds the deed page content for a software license.
 * @param spdxId SPDX identifier from the route, e.g. 'MIT'.
 * @returns The deed, or null if no deed page has been published for that identifier.
 */
export const getSoftwareLicenseDeed = (spdxId: string | undefined) =>
  softwareLicenseDeeds.find((deed) => deed.spdxId === spdxId) ?? null;
