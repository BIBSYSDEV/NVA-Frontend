import { LicenseDeedSlug, LicenseUri } from '../../types/license.types';

/**
 * A term a license grants, requires or withholds. The deeds reuse one shared vocabulary rather than
 * prose per license. Mirrors the rule vocabulary on choosealicense.com, which these summaries are derived from.
 */
export enum LicenseRule {
  CommercialUse = 'commercial_use',
  Distribution = 'distribution',
  Modifications = 'modifications',
  PatentUse = 'patent_use',
  PrivateUse = 'private_use',
  DiscloseSource = 'disclose_source',
  DiscloseSourceForFile = 'disclose_source_for_file',
  DiscloseSourceForLibrary = 'disclose_source_for_library',
  DocumentChanges = 'document_changes',
  IncludeCopyright = 'include_copyright',
  NetworkUseDisclose = 'network_use_disclose',
  SameLicense = 'same_license',
  SameLicenseForFile = 'same_license_for_file',
  SameLicenseForLibrary = 'same_license_for_library',
  SameLicenseWithCompatibility = 'same_license_with_compatibility',
  Liability = 'liability',
  NonEndorsement = 'non_endorsement',
  TrademarkUse = 'trademark_use',
  Warranty = 'warranty',
}

export enum LicenseRuleGroup {
  Permissions = 'permissions',
  Conditions = 'conditions',
  Limitations = 'limitations',
}

/**
 * Identifies the note explaining the two menu entries a GPL-family deed covers.
 */
export enum LicenseVersionNote {
  GPL_3_0 = 'gpl_3_0',
  GPL_2_0 = 'gpl_2_0',
  AGPL_3_0 = 'agpl_3_0',
  LGPL_3_0 = 'lgpl_3_0',
}

interface LicenseTerms {
  [LicenseRuleGroup.Permissions]: LicenseRule[];
  [LicenseRuleGroup.Conditions]: LicenseRule[];
  [LicenseRuleGroup.Limitations]: LicenseRule[];
}

export interface LicenseDeed extends LicenseTerms {
  slug: LicenseDeedSlug;
  licenseId: LicenseUri;
  officialUrl: string;
  /** Set for the GPL-family deeds, which must explain both menu entries they cover. */
  versionNote?: LicenseVersionNote;
}

const mitTerms: LicenseTerms = {
  permissions: [LicenseRule.CommercialUse, LicenseRule.Modifications, LicenseRule.Distribution, LicenseRule.PrivateUse],
  conditions: [LicenseRule.IncludeCopyright],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const apache2Terms: LicenseTerms = {
  permissions: [
    LicenseRule.CommercialUse,
    LicenseRule.Modifications,
    LicenseRule.Distribution,
    LicenseRule.PatentUse,
    LicenseRule.PrivateUse,
  ],
  conditions: [LicenseRule.IncludeCopyright, LicenseRule.DocumentChanges],
  limitations: [LicenseRule.TrademarkUse, LicenseRule.Liability, LicenseRule.Warranty],
};

const bsd3Terms: LicenseTerms = {
  permissions: [LicenseRule.CommercialUse, LicenseRule.Modifications, LicenseRule.Distribution, LicenseRule.PrivateUse],
  conditions: [LicenseRule.IncludeCopyright],
  limitations: [LicenseRule.NonEndorsement, LicenseRule.Liability, LicenseRule.Warranty],
};

const bsd2Terms: LicenseTerms = {
  permissions: bsd3Terms.permissions,
  conditions: bsd3Terms.conditions,
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const gpl2Terms: LicenseTerms = {
  permissions: [LicenseRule.CommercialUse, LicenseRule.Modifications, LicenseRule.Distribution, LicenseRule.PrivateUse],
  conditions: [
    LicenseRule.DiscloseSource,
    LicenseRule.IncludeCopyright,
    LicenseRule.SameLicense,
    LicenseRule.DocumentChanges,
  ],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const gpl3Terms: LicenseTerms = {
  permissions: [
    LicenseRule.CommercialUse,
    LicenseRule.Modifications,
    LicenseRule.Distribution,
    LicenseRule.PatentUse,
    LicenseRule.PrivateUse,
  ],
  conditions: [
    LicenseRule.DiscloseSource,
    LicenseRule.IncludeCopyright,
    LicenseRule.SameLicense,
    LicenseRule.DocumentChanges,
  ],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const agpl3Terms: LicenseTerms = {
  permissions: gpl3Terms.permissions,
  conditions: [
    LicenseRule.DiscloseSource,
    LicenseRule.IncludeCopyright,
    LicenseRule.NetworkUseDisclose,
    LicenseRule.SameLicense,
    LicenseRule.DocumentChanges,
  ],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const lgpl3Terms: LicenseTerms = {
  permissions: gpl3Terms.permissions,
  conditions: [
    LicenseRule.DiscloseSourceForLibrary,
    LicenseRule.IncludeCopyright,
    LicenseRule.SameLicenseForLibrary,
    LicenseRule.DocumentChanges,
  ],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const mpl2Terms: LicenseTerms = {
  permissions: [
    LicenseRule.CommercialUse,
    LicenseRule.Modifications,
    LicenseRule.Distribution,
    LicenseRule.PatentUse,
    LicenseRule.PrivateUse,
  ],
  conditions: [LicenseRule.DiscloseSourceForFile, LicenseRule.IncludeCopyright, LicenseRule.SameLicenseForFile],
  limitations: [LicenseRule.TrademarkUse, LicenseRule.Liability, LicenseRule.Warranty],
};

const eupl12Terms: LicenseTerms = {
  permissions: [
    LicenseRule.CommercialUse,
    LicenseRule.Modifications,
    LicenseRule.Distribution,
    LicenseRule.PatentUse,
    LicenseRule.PrivateUse,
  ],
  conditions: [
    LicenseRule.DiscloseSource,
    LicenseRule.IncludeCopyright,
    LicenseRule.NetworkUseDisclose,
    LicenseRule.SameLicenseWithCompatibility,
    LicenseRule.DocumentChanges,
  ],
  limitations: [LicenseRule.Liability, LicenseRule.TrademarkUse, LicenseRule.Warranty],
};

export const licenseDeeds: LicenseDeed[] = [
  {
    slug: LicenseDeedSlug.MIT,
    licenseId: LicenseUri.MIT,
    officialUrl: 'https://opensource.org/license/mit',
    ...mitTerms,
  },
  {
    slug: LicenseDeedSlug.Apache_2_0,
    licenseId: LicenseUri.Apache_2_0,
    officialUrl: 'https://www.apache.org/licenses/LICENSE-2.0',
    ...apache2Terms,
  },
  {
    slug: LicenseDeedSlug.BSD_3_Clause,
    licenseId: LicenseUri.BSD_3_Clause,
    officialUrl: 'https://opensource.org/license/bsd-3-clause',
    ...bsd3Terms,
  },
  {
    slug: LicenseDeedSlug.BSD_2_Clause,
    licenseId: LicenseUri.BSD_2_Clause,
    officialUrl: 'https://opensource.org/license/bsd-2-clause',
    ...bsd2Terms,
  },
  {
    slug: LicenseDeedSlug.MPL_2_0,
    licenseId: LicenseUri.MPL_2_0,
    officialUrl: 'https://www.mozilla.org/en-US/MPL/2.0/',
    ...mpl2Terms,
  },
  {
    slug: LicenseDeedSlug.EUPL_1_2,
    licenseId: LicenseUri.EUPL_1_2,
    officialUrl: 'https://interoperable-europe.ec.europa.eu/collection/eupl/eupl-text-eupl-12',
    ...eupl12Terms,
  },
  {
    slug: LicenseDeedSlug.GPL_3_0,
    licenseId: LicenseUri.GPL_3_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/gpl-3.0.html',
    ...gpl3Terms,
    versionNote: LicenseVersionNote.GPL_3_0,
  },
  {
    slug: LicenseDeedSlug.GPL_2_0,
    licenseId: LicenseUri.GPL_2_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
    ...gpl2Terms,
    versionNote: LicenseVersionNote.GPL_2_0,
  },
  {
    slug: LicenseDeedSlug.AGPL_3_0,
    licenseId: LicenseUri.AGPL_3_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/agpl-3.0.html',
    ...agpl3Terms,
    versionNote: LicenseVersionNote.AGPL_3_0,
  },
  {
    slug: LicenseDeedSlug.LGPL_3_0,
    licenseId: LicenseUri.LGPL_3_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/lgpl-3.0.html',
    ...lgpl3Terms,
    versionNote: LicenseVersionNote.LGPL_3_0,
  },
];

/**
 * The choosealicense.com page a deed's guidance points are derived from, which its attribution links to.
 * @param slug Identifies the deed.
 * @returns Url of the license page on choosealicense.com.
 */
export const getLicenseGuidanceUrl = (slug: LicenseDeedSlug) => `https://choosealicense.com/licenses/${slug}/`;

/**
 * Looks up the deed to show for a license deed path.
 * @param slug Value of the {@link UrlPathTemplate.LicenseDeed} path parameter, which is whatever the
 * visitor typed and need not be a known slug.
 * @returns The matching deed, or null when the path names no deed we serve.
 */
export const getLicenseDeed = (slug?: string) => licenseDeeds.find((deed) => deed.slug === slug) ?? null;
