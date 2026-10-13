import { LicenseDeedSlug, LicenseUri } from '../../types/license.types';

/**
 * A term a license grants, requires or withholds. The deeds reuse one shared vocabulary rather than
 * prose per license, so the same term reads identically across all of them and only has to be
 * translated once. Doubles as the suffix of the translation keys under `licenses.rules`.
 *
 * Mirrors the rule vocabulary on choosealicense.com, which these summaries are derived from.
 */
export enum LicenseRule {
  CommercialUse = 'commercial_use',
  Distribution = 'distribution',
  Modifications = 'modifications',
  PatentUse = 'patent_use',
  PrivateUse = 'private_use',
  DiscloseSource = 'disclose_source',
  DocumentChanges = 'document_changes',
  IncludeCopyright = 'include_copyright',
  IncludeCopyrightInSource = 'include_copyright_in_source',
  NetworkUseDisclose = 'network_use_disclose',
  SameLicense = 'same_license',
  SameLicenseForFile = 'same_license_for_file',
  SameLicenseForLibrary = 'same_license_for_library',
  Liability = 'liability',
  TrademarkUse = 'trademark_use',
  Warranty = 'warranty',
}

/**
 * Which section of the deed a set of rules belongs to. Decides the heading and the icon, and doubles
 * as the suffix of the translation keys under `licenses.deed`.
 */
export enum LicenseRuleGroup {
  Permissions = 'permissions',
  Conditions = 'conditions',
  Limitations = 'limitations',
}

/**
 * The two ways a GPL-family license can treat later versions of itself. Both are explained on the
 * family's deed, since the menu offers them as separate choices that share this one page.
 */
export enum LicenseVersionNote {
  OrLater = 'or_later',
  Only = 'only',
}

interface LicenseTerms {
  [LicenseRuleGroup.Permissions]: LicenseRule[];
  [LicenseRuleGroup.Conditions]: LicenseRule[];
  [LicenseRuleGroup.Limitations]: LicenseRule[];
}

export interface LicenseDeed extends LicenseTerms {
  slug: LicenseDeedSlug;
  /**
   * The license this deed summarises, so the page can reuse its name and short description. For a
   * GPL-family deed this is the -or-later variant, whose {@link LicenseInfo.shortName} names the
   * license without a version scope — the page covers both variants.
   */
  licenseId: LicenseUri;
  /** The authoritative license text. The deed is only a summary; this is what actually governs. */
  officialUrl: string;
  /** Set for the GPL-family deeds, which must explain both version scopes the menu offers. */
  hasVersionVariants?: boolean;
}

// NOTE: Each set is named after the license text rather than a menu entry, since the -only and
// -or-later variants of a GPL-family license grant and require exactly the same things.

const mitTerms: LicenseTerms = {
  permissions: [LicenseRule.CommercialUse, LicenseRule.Distribution, LicenseRule.Modifications, LicenseRule.PrivateUse],
  conditions: [LicenseRule.IncludeCopyright],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const apache2Terms: LicenseTerms = {
  permissions: [
    LicenseRule.CommercialUse,
    LicenseRule.Distribution,
    LicenseRule.Modifications,
    LicenseRule.PatentUse,
    LicenseRule.PrivateUse,
  ],
  conditions: [LicenseRule.IncludeCopyright, LicenseRule.DocumentChanges],
  limitations: [LicenseRule.TrademarkUse, LicenseRule.Liability, LicenseRule.Warranty],
};

const bsdTerms: LicenseTerms = {
  permissions: [LicenseRule.CommercialUse, LicenseRule.Distribution, LicenseRule.Modifications, LicenseRule.PrivateUse],
  conditions: [LicenseRule.IncludeCopyright],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const gpl2Terms: LicenseTerms = {
  permissions: [LicenseRule.CommercialUse, LicenseRule.Distribution, LicenseRule.Modifications, LicenseRule.PrivateUse],
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
    LicenseRule.Distribution,
    LicenseRule.Modifications,
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
    LicenseRule.DiscloseSource,
    LicenseRule.IncludeCopyright,
    LicenseRule.SameLicenseForLibrary,
    LicenseRule.DocumentChanges,
  ],
  limitations: [LicenseRule.Liability, LicenseRule.Warranty],
};

const mpl2Terms: LicenseTerms = {
  permissions: [
    LicenseRule.CommercialUse,
    LicenseRule.Distribution,
    LicenseRule.Modifications,
    LicenseRule.PatentUse,
    LicenseRule.PrivateUse,
  ],
  conditions: [LicenseRule.DiscloseSource, LicenseRule.IncludeCopyrightInSource, LicenseRule.SameLicenseForFile],
  limitations: [LicenseRule.Liability, LicenseRule.TrademarkUse, LicenseRule.Warranty],
};

const eupl12Terms: LicenseTerms = {
  permissions: [
    LicenseRule.CommercialUse,
    LicenseRule.Distribution,
    LicenseRule.Modifications,
    LicenseRule.PatentUse,
    LicenseRule.PrivateUse,
  ],
  conditions: [
    LicenseRule.DiscloseSource,
    LicenseRule.IncludeCopyright,
    LicenseRule.NetworkUseDisclose,
    LicenseRule.SameLicense,
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
    ...bsdTerms,
  },
  {
    slug: LicenseDeedSlug.BSD_2_Clause,
    licenseId: LicenseUri.BSD_2_Clause,
    officialUrl: 'https://opensource.org/license/bsd-2-clause',
    ...bsdTerms,
  },
  {
    slug: LicenseDeedSlug.MPL_2_0,
    licenseId: LicenseUri.MPL_2_0,
    officialUrl: 'https://www.mozilla.org/MPL/2.0/',
    ...mpl2Terms,
  },
  {
    slug: LicenseDeedSlug.EUPL_1_2,
    licenseId: LicenseUri.EUPL_1_2,
    officialUrl: 'https://eupl.eu/1.2/en/',
    ...eupl12Terms,
  },
  {
    slug: LicenseDeedSlug.GPL_3_0,
    licenseId: LicenseUri.GPL_3_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/gpl-3.0.html',
    ...gpl3Terms,
    hasVersionVariants: true,
  },
  {
    slug: LicenseDeedSlug.GPL_2_0,
    licenseId: LicenseUri.GPL_2_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/old-licenses/gpl-2.0.html',
    ...gpl2Terms,
    hasVersionVariants: true,
  },
  {
    slug: LicenseDeedSlug.AGPL_3_0,
    licenseId: LicenseUri.AGPL_3_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/agpl-3.0.html',
    ...agpl3Terms,
    hasVersionVariants: true,
  },
  {
    slug: LicenseDeedSlug.LGPL_3_0,
    licenseId: LicenseUri.LGPL_3_0_or_later,
    officialUrl: 'https://www.gnu.org/licenses/lgpl-3.0.html',
    ...lgpl3Terms,
    hasVersionVariants: true,
  },
];

/**
 * Looks up the deed to show for a license deed path.
 * @param slug Value of the {@link UrlPathTemplate.LicenseDeed} path parameter, which is whatever the
 * visitor typed and need not be a known slug.
 * @returns The matching deed, or null when the path names no deed we serve.
 */
export const getLicenseDeed = (slug?: string) => licenseDeeds.find((deed) => deed.slug === slug) ?? null;
