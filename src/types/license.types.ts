import * as LicenseImages from '../resources/images/licenses';
import i18n from '../translations/i18n';
import { getLicenseDeedPath, UrlPathTemplate } from '../utils/urlPaths';

export enum LicenseUri {
  CC_BY_4 = 'https://creativecommons.org/licenses/by/4.0/',
  CC_BY_3 = 'https://creativecommons.org/licenses/by/3.0/',
  CC_BY_2_5 = 'https://creativecommons.org/licenses/by/2.5/',
  CC_BY_2 = 'https://creativecommons.org/licenses/by/2.0/',
  CC_BY_1 = 'https://creativecommons.org/licenses/by/1.0/',
  CC_BY_SA_4 = 'https://creativecommons.org/licenses/by-sa/4.0/',
  CC_BY_SA_3 = 'https://creativecommons.org/licenses/by-sa/3.0/',
  CC_BY_SA_2_5 = 'https://creativecommons.org/licenses/by-sa/2.5/',
  CC_BY_SA_2 = 'https://creativecommons.org/licenses/by-sa/2.0/',
  CC_BY_SA_1 = 'https://creativecommons.org/licenses/by-sa/1.0/',
  CC_BY_ND_4 = 'https://creativecommons.org/licenses/by-nd/4.0/',
  CC_BY_ND_3 = 'https://creativecommons.org/licenses/by-nd/3.0/',
  CC_BY_ND_2_5 = 'https://creativecommons.org/licenses/by-nd/2.5/',
  CC_BY_ND_2 = 'https://creativecommons.org/licenses/by-nd/2.0/',
  CC_BY_ND_1 = 'https://creativecommons.org/licenses/by-nd/1.0/',
  CC_BY_NC_4 = 'https://creativecommons.org/licenses/by-nc/4.0/',
  CC_BY_NC_3 = 'https://creativecommons.org/licenses/by-nc/3.0/',
  CC_BY_NC_2_5 = 'https://creativecommons.org/licenses/by-nc/2.5/',
  CC_BY_NC_2 = 'https://creativecommons.org/licenses/by-nc/2.0/',
  CC_BY_NC_1 = 'https://creativecommons.org/licenses/by-nc/1.0/',
  CC_BY_NC_SA_4 = 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  CC_BY_NC_SA_3 = 'https://creativecommons.org/licenses/by-nc-sa/3.0/',
  CC_BY_NC_SA_2_5 = 'https://creativecommons.org/licenses/by-nc-sa/2.5/',
  CC_BY_NC_SA_2 = 'https://creativecommons.org/licenses/by-nc-sa/2.0/',
  CC_BY_NC_SA_1 = 'https://creativecommons.org/licenses/by-nc-sa/1.0/',
  CC_BY_NC_ND_4 = 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  CC_BY_NC_ND_3 = 'https://creativecommons.org/licenses/by-nc-nd/3.0/',
  CC_BY_NC_ND_2_5 = 'https://creativecommons.org/licenses/by-nc-nd/2.5/',
  CC_BY_NC_ND_2 = 'https://creativecommons.org/licenses/by-nc-nd/2.0/',
  CC_BY_ND_NC_1 = 'https://creativecommons.org/licenses/by-nd-nc/1.0/',
  CC0 = 'https://creativecommons.org/publicdomain/zero/1.0/',
  CopyrightAct = `https://nva.sikt.no${UrlPathTemplate.CopyrightAct}`,
  MIT = 'https://spdx.org/licenses/MIT.html',
  Apache_2_0 = 'https://spdx.org/licenses/Apache-2.0.html',
  GPL_3_0_or_later = 'https://spdx.org/licenses/GPL-3.0-or-later.html',
  BSD_3_Clause = 'https://spdx.org/licenses/BSD-3-Clause.html',
  EUPL_1_2 = 'https://spdx.org/licenses/EUPL-1.2.html',
  BSD_2_Clause = 'https://spdx.org/licenses/BSD-2-Clause.html',
  GPL_2_0_or_later = 'https://spdx.org/licenses/GPL-2.0-or-later.html',
  AGPL_3_0_or_later = 'https://spdx.org/licenses/AGPL-3.0-or-later.html',
  LGPL_3_0_or_later = 'https://spdx.org/licenses/LGPL-3.0-or-later.html',
  MPL_2_0 = 'https://spdx.org/licenses/MPL-2.0.html',
  GPL_2_0_only = 'https://spdx.org/licenses/GPL-2.0-only.html',
  GPL_3_0_only = 'https://spdx.org/licenses/GPL-3.0-only.html',
  AGPL_3_0_only = 'https://spdx.org/licenses/AGPL-3.0-only.html',
  LGPL_3_0_only = 'https://spdx.org/licenses/LGPL-3.0-only.html',
}

/**
 * The deed page NVA serves for a license, identified by the SPDX id in lower case. Used both as the
 * {@link UrlPathTemplate.LicenseDeed} path segment and as the key of the deed's content.
 *
 * Ten deeds cover the fourteen software licenses: a GPL-family deed serves both the -only and the
 * -or-later variant of its version, which differ in version scope but not in terms, and says so.
 *
 * CC0 is deliberately absent: it links to the Norwegian Creative Commons deed instead of one of ours.
 */
export enum LicenseDeedSlug {
  MIT = 'mit',
  Apache_2_0 = 'apache-2.0',
  GPL_3_0 = 'gpl-3.0',
  GPL_2_0 = 'gpl-2.0',
  AGPL_3_0 = 'agpl-3.0',
  LGPL_3_0 = 'lgpl-3.0',
  BSD_3_Clause = 'bsd-3-clause',
  BSD_2_Clause = 'bsd-2-clause',
  MPL_2_0 = 'mpl-2.0',
  EUPL_1_2 = 'eupl-1.2',
}

export interface LicenseInfo {
  id: LicenseUri;
  name: string;
  description: string;
  logo?: string;
  /**
   * Page explaining what the license means. Relative for the deeds NVA serves itself, so that each
   * environment links to its own, and absolute for the deeds Creative Commons hosts. Required, so a
   * license added without one fails to compile rather than rendering as unlinked text.
   */
  link: string;
  version?: 1 | 2 | 2.5 | 3 | 4;
  additionalInformation?: string;
  /**
   * The license without its version scope, for contexts that do not list the -only variants and so need
   * no qualifier to tell them apart. Only set where {@link LicenseInfo.name} carries such a qualifier.
   */
  shortName?: string;
}

export const licenses: LicenseInfo[] = [
  {
    id: LicenseUri.CC_BY_4,
    name: i18n.t('licenses.labels.cc_by', { version: '4.0' }),
    description: i18n.t('licenses.description.cc_by'),
    link: i18n.t('licenses.links.cc_by', { version: '4.0' }),
    logo: LicenseImages.ccByLogo,
    version: 4,
  },
  {
    id: LicenseUri.CC_BY_3,
    name: i18n.t('licenses.labels.cc_by', { version: '3.0' }),
    description: i18n.t('licenses.description.cc_by'),
    link: i18n.t('licenses.links.cc_by', { version: '3.0' }),
    logo: LicenseImages.ccByLogo,
    version: 3,
  },
  {
    id: LicenseUri.CC_BY_2_5,
    name: i18n.t('licenses.labels.cc_by', { version: '2.5' }),
    description: i18n.t('licenses.description.cc_by'),
    link: i18n.t('licenses.links.cc_by', { version: '2.5' }),
    logo: LicenseImages.ccByLogo,
    version: 2.5,
  },
  {
    id: LicenseUri.CC_BY_2,
    name: i18n.t('licenses.labels.cc_by', { version: '2.0' }),
    description: i18n.t('licenses.description.cc_by'),
    link: i18n.t('licenses.links.cc_by', { version: '2.0' }),
    logo: LicenseImages.ccByLogo,
    version: 2,
  },
  {
    id: LicenseUri.CC_BY_1,
    name: i18n.t('licenses.labels.cc_by', { version: '1.0' }),
    description: i18n.t('licenses.description.cc_by'),
    link: i18n.t('licenses.links.cc_by', { version: '1.0' }),
    logo: LicenseImages.ccByLogo,
    version: 1,
  },
  {
    id: LicenseUri.CC_BY_SA_4,
    name: i18n.t('licenses.labels.cc_by_sa', { version: '4.0' }),
    description: i18n.t('licenses.description.cc_by_sa'),
    link: i18n.t('licenses.links.cc_by_sa', { version: '4.0' }),
    logo: LicenseImages.ccBySaLogo,
    version: 4,
  },
  {
    id: LicenseUri.CC_BY_SA_3,
    name: i18n.t('licenses.labels.cc_by_sa', { version: '3.0' }),
    description: i18n.t('licenses.description.cc_by_sa'),
    link: i18n.t('licenses.links.cc_by_sa', { version: '3.0' }),
    logo: LicenseImages.ccBySaLogo,
    version: 3,
  },
  {
    id: LicenseUri.CC_BY_SA_2_5,
    name: i18n.t('licenses.labels.cc_by_sa', { version: '2.5' }),
    description: i18n.t('licenses.description.cc_by_sa'),
    link: i18n.t('licenses.links.cc_by_sa', { version: '2.5' }),
    logo: LicenseImages.ccBySaLogo,
    version: 2.5,
  },
  {
    id: LicenseUri.CC_BY_SA_2,
    name: i18n.t('licenses.labels.cc_by_sa', { version: '2.0' }),
    description: i18n.t('licenses.description.cc_by_sa'),
    link: i18n.t('licenses.links.cc_by_sa', { version: '2.0' }),
    logo: LicenseImages.ccBySaLogo,
    version: 2,
  },
  {
    id: LicenseUri.CC_BY_SA_1,
    name: i18n.t('licenses.labels.cc_by_sa', { version: '1.0' }),
    description: i18n.t('licenses.description.cc_by_sa'),
    link: i18n.t('licenses.links.cc_by_sa', { version: '1.0' }),
    logo: LicenseImages.ccBySaLogo,
    version: 1,
  },
  {
    id: LicenseUri.CC_BY_ND_4,
    name: i18n.t('licenses.labels.cc_by_nd', { version: '4.0' }),
    description: i18n.t('licenses.description.cc_by_nd'),
    link: i18n.t('licenses.links.cc_by_nd', { version: '4.0' }),
    logo: LicenseImages.ccByNdLogo,
    version: 4,
  },
  {
    id: LicenseUri.CC_BY_ND_3,
    name: i18n.t('licenses.labels.cc_by_nd', { version: '3.0' }),
    description: i18n.t('licenses.description.cc_by_nd'),
    link: i18n.t('licenses.links.cc_by_nd', { version: '3.0' }),
    logo: LicenseImages.ccByNdLogo,
    version: 3,
  },
  {
    id: LicenseUri.CC_BY_ND_2_5,
    name: i18n.t('licenses.labels.cc_by_nd', { version: '2.5' }),
    description: i18n.t('licenses.description.cc_by_nd'),
    link: i18n.t('licenses.links.cc_by_nd', { version: '2.5' }),
    logo: LicenseImages.ccByNdLogo,
    version: 2.5,
  },
  {
    id: LicenseUri.CC_BY_ND_2,
    name: i18n.t('licenses.labels.cc_by_nd', { version: '2.0' }),
    description: i18n.t('licenses.description.cc_by_nd'),
    link: i18n.t('licenses.links.cc_by_nd', { version: '2.0' }),
    logo: LicenseImages.ccByNdLogo,
    version: 2,
  },
  {
    id: LicenseUri.CC_BY_ND_1,
    name: i18n.t('licenses.labels.cc_by_nd', { version: '1.0' }),
    description: i18n.t('licenses.description.cc_by_nd'),
    link: i18n.t('licenses.links.cc_by_nd', { version: '1.0' }),
    logo: LicenseImages.ccByNdLogo,
    version: 1,
  },
  {
    id: LicenseUri.CC_BY_NC_4,
    name: i18n.t('licenses.labels.cc_by_nc', { version: '4.0' }),
    description: i18n.t('licenses.description.cc_by_nc'),
    link: i18n.t('licenses.links.cc_by_nc', { version: '4.0' }),
    logo: LicenseImages.ccByNcLogo,
    version: 4,
  },
  {
    id: LicenseUri.CC_BY_NC_3,
    name: i18n.t('licenses.labels.cc_by_nc', { version: '3.0' }),
    description: i18n.t('licenses.description.cc_by_nc'),
    link: i18n.t('licenses.links.cc_by_nc', { version: '3.0' }),
    logo: LicenseImages.ccByNcLogo,
    version: 3,
  },
  {
    id: LicenseUri.CC_BY_NC_2_5,
    name: i18n.t('licenses.labels.cc_by_nc', { version: '2.5' }),
    description: i18n.t('licenses.description.cc_by_nc'),
    link: i18n.t('licenses.links.cc_by_nc', { version: '2.5' }),
    logo: LicenseImages.ccByNcLogo,
    version: 2.5,
  },
  {
    id: LicenseUri.CC_BY_NC_2,
    name: i18n.t('licenses.labels.cc_by_nc', { version: '2.0' }),
    description: i18n.t('licenses.description.cc_by_nc'),
    link: i18n.t('licenses.links.cc_by_nc', { version: '2.0' }),
    logo: LicenseImages.ccByNcLogo,
    version: 2,
  },
  {
    id: LicenseUri.CC_BY_NC_1,
    name: i18n.t('licenses.labels.cc_by_nc', { version: '1.0' }),
    description: i18n.t('licenses.description.cc_by_nc'),
    link: i18n.t('licenses.links.cc_by_nc', { version: '1.0' }),
    logo: LicenseImages.ccByNcLogo,
    version: 1,
  },
  {
    id: LicenseUri.CC_BY_NC_SA_4,
    name: i18n.t('licenses.labels.cc_by_nc_sa', { version: '4.0' }),
    description: i18n.t('licenses.description.cc_by_nc_sa'),
    link: i18n.t('licenses.links.cc_by_nc_sa', { version: '4.0' }),
    logo: LicenseImages.ccByNcSaLogo,
    version: 4,
  },
  {
    id: LicenseUri.CC_BY_NC_SA_3,
    name: i18n.t('licenses.labels.cc_by_nc_sa', { version: '3.0' }),
    description: i18n.t('licenses.description.cc_by_nc_sa'),
    link: i18n.t('licenses.links.cc_by_nc_sa', { version: '3.0' }),
    logo: LicenseImages.ccByNcSaLogo,
    version: 3,
  },
  {
    id: LicenseUri.CC_BY_NC_SA_2_5,
    name: i18n.t('licenses.labels.cc_by_nc_sa', { version: '2.5' }),
    description: i18n.t('licenses.description.cc_by_nc_sa'),
    link: i18n.t('licenses.links.cc_by_nc_sa', { version: '2.5' }),
    logo: LicenseImages.ccByNcSaLogo,
    version: 2.5,
  },
  {
    id: LicenseUri.CC_BY_NC_SA_2,
    name: i18n.t('licenses.labels.cc_by_nc_sa', { version: '2.0' }),
    description: i18n.t('licenses.description.cc_by_nc_sa'),
    link: i18n.t('licenses.links.cc_by_nc_sa', { version: '2.0' }),
    logo: LicenseImages.ccByNcSaLogo,
    version: 2,
  },
  {
    id: LicenseUri.CC_BY_NC_SA_1,
    name: i18n.t('licenses.labels.cc_by_nc_sa', { version: '1.0' }),
    description: i18n.t('licenses.description.cc_by_nc_sa'),
    link: i18n.t('licenses.links.cc_by_nc_sa', { version: '1.0' }),
    logo: LicenseImages.ccByNcSaLogo,
    version: 1,
  },
  {
    id: LicenseUri.CC_BY_NC_ND_4,
    name: i18n.t('licenses.labels.cc_by_nc_nd', { version: '4.0' }),
    description: i18n.t('licenses.description.cc_by_nc_nd'),
    link: i18n.t('licenses.links.cc_by_nc_nd', { version: '4.0' }),
    logo: LicenseImages.ccByNcNdLogo,
    version: 4,
  },
  {
    id: LicenseUri.CC_BY_NC_ND_3,
    name: i18n.t('licenses.labels.cc_by_nc_nd', { version: '3.0' }),
    description: i18n.t('licenses.description.cc_by_nc_nd'),
    link: i18n.t('licenses.links.cc_by_nc_nd', { version: '3.0' }),
    logo: LicenseImages.ccByNcNdLogo,
    version: 3,
  },
  {
    id: LicenseUri.CC_BY_NC_ND_2_5,
    name: i18n.t('licenses.labels.cc_by_nc_nd', { version: '2.5' }),
    description: i18n.t('licenses.description.cc_by_nc_nd'),
    link: i18n.t('licenses.links.cc_by_nc_nd', { version: '2.5' }),
    logo: LicenseImages.ccByNcNdLogo,
    version: 2.5,
  },
  {
    id: LicenseUri.CC_BY_NC_ND_2,
    name: i18n.t('licenses.labels.cc_by_nc_nd', { version: '2.0' }),
    description: i18n.t('licenses.description.cc_by_nc_nd'),
    link: i18n.t('licenses.links.cc_by_nc_nd', { version: '2.0' }),
    logo: LicenseImages.ccByNcNdLogo,
    version: 2,
  },
  {
    id: LicenseUri.CC_BY_ND_NC_1,
    name: i18n.t('licenses.labels.cc_by_nd_nc', { version: '1.0' }),
    description: i18n.t('licenses.description.cc_by_nc_nd'),
    link: i18n.t('licenses.links.cc_by_nd_nc', { version: '1.0' }),
    logo: LicenseImages.ccByNcNdLogo,
    version: 1,
  },
  {
    id: LicenseUri.CC0,
    name: i18n.t('licenses.labels.cc0', { version: '1.0' }),
    description: i18n.t('licenses.description.cc0'),
    link: i18n.t('licenses.links.cc0'),
    logo: LicenseImages.cc0Logo,
    additionalInformation: i18n.t('licenses.additional_info.cc0'),
  },
  {
    id: LicenseUri.CopyrightAct,
    name: i18n.t('licenses.labels.copyright_act'),
    description: i18n.t('licenses.description.copyright_act'),
    link: LicenseUri.CopyrightAct,
  },
  {
    id: LicenseUri.MIT,
    name: i18n.t('licenses.labels.mit'),
    description: i18n.t('licenses.description.mit'),
    link: getLicenseDeedPath(LicenseDeedSlug.MIT),
  },
  {
    id: LicenseUri.Apache_2_0,
    name: i18n.t('licenses.labels.apache_2_0'),
    description: i18n.t('licenses.description.apache_2_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.Apache_2_0),
  },
  {
    id: LicenseUri.GPL_3_0_or_later,
    name: i18n.t('licenses.labels.gpl_3_0_or_later'),
    description: i18n.t('licenses.description.gpl_3_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.GPL_3_0),
  },
  {
    id: LicenseUri.BSD_3_Clause,
    name: i18n.t('licenses.labels.bsd_3_clause'),
    description: i18n.t('licenses.description.bsd_3_clause'),
    link: getLicenseDeedPath(LicenseDeedSlug.BSD_3_Clause),
  },
  {
    id: LicenseUri.EUPL_1_2,
    name: i18n.t('licenses.labels.eupl_1_2'),
    description: i18n.t('licenses.description.eupl_1_2'),
    link: getLicenseDeedPath(LicenseDeedSlug.EUPL_1_2),
  },
  {
    id: LicenseUri.BSD_2_Clause,
    name: i18n.t('licenses.labels.bsd_2_clause'),
    description: i18n.t('licenses.description.bsd_2_clause'),
    link: getLicenseDeedPath(LicenseDeedSlug.BSD_2_Clause),
  },
  {
    id: LicenseUri.GPL_2_0_or_later,
    name: i18n.t('licenses.labels.gpl_2_0_or_later'),
    shortName: i18n.t('licenses.labels.gpl_2_0'),
    description: i18n.t('licenses.description.gpl_2_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.GPL_2_0),
  },
  {
    id: LicenseUri.AGPL_3_0_or_later,
    name: i18n.t('licenses.labels.agpl_3_0_or_later'),
    shortName: i18n.t('licenses.labels.agpl_3_0'),
    description: i18n.t('licenses.description.agpl_3_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.AGPL_3_0),
  },
  {
    id: LicenseUri.LGPL_3_0_or_later,
    name: i18n.t('licenses.labels.lgpl_3_0_or_later'),
    shortName: i18n.t('licenses.labels.lgpl_3_0'),
    description: i18n.t('licenses.description.lgpl_3_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.LGPL_3_0),
  },
  {
    id: LicenseUri.MPL_2_0,
    name: i18n.t('licenses.labels.mpl_2_0'),
    description: i18n.t('licenses.description.mpl_2_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.MPL_2_0),
  },
  // NOTE: The -only variants are separate menu entries because the distinction between them and the
  // -or-later variants must survive in the stored value. They get their own deed pages too, which
  // differ from the -or-later ones only by the version note.
  {
    id: LicenseUri.GPL_2_0_only,
    name: i18n.t('licenses.labels.gpl_2_0_only'),
    description: i18n.t('licenses.description.gpl_2_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.GPL_2_0),
  },
  {
    id: LicenseUri.GPL_3_0_only,
    name: i18n.t('licenses.labels.gpl_3_0_only'),
    description: i18n.t('licenses.description.gpl_3_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.GPL_3_0),
  },
  {
    id: LicenseUri.AGPL_3_0_only,
    name: i18n.t('licenses.labels.agpl_3_0_only'),
    description: i18n.t('licenses.description.agpl_3_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.AGPL_3_0),
  },
  {
    id: LicenseUri.LGPL_3_0_only,
    name: i18n.t('licenses.labels.lgpl_3_0_only'),
    description: i18n.t('licenses.description.lgpl_3_0'),
    link: getLicenseDeedPath(LicenseDeedSlug.LGPL_3_0),
  },
];
