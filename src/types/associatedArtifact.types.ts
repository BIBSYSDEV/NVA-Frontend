import { Uppy as UppyType } from '@uppy/core';
import * as LicenseImages from '../resources/images/licenses';
import i18n from '../translations/i18n';

export enum LicenseUri {
  CC_BY = 'https://creativecommons.org/licenses/by/4.0',
  CC_BY_SA = 'https://creativecommons.org/licenses/by-sa/4.0',
  CC_BY_ND = 'https://creativecommons.org/licenses/by-nd/4.0',
  CC_BY_NC = 'https://creativecommons.org/licenses/by-nc/4.0',
  CC_BY_NC_SA = 'https://creativecommons.org/licenses/by-nc-sa/4.0',
  CC_BY_NC_ND = 'https://creativecommons.org/licenses/by-nc-nd/4.0',
  CC0 = 'https://creativecommons.org/publicdomain/zero/1.0',
  RightsReserved = 'https://rightsstatements.org/page/InC/1.0',
}

interface LicenseInfo {
  id: LicenseUri;
  name: string;
  description: string;
  logo: string;
  link?: string;
}

export const licenses: LicenseInfo[] = [
  {
    id: LicenseUri.RightsReserved,
    name: i18n.t('licenses.labels.RightsReserved'),
    description: i18n.t('licenses.description.rights_reserved'),
    logo: LicenseImages.rightsReservedLogo,
    link: i18n.t('licenses.links.rights_reserved'),
  },
  {
    id: LicenseUri.CC_BY,
    name: 'CC BY',
    description: i18n.t('licenses.description.cc_by'),
    logo: LicenseImages.ccByLogo,
    link: i18n.t('licenses.links.cc_by'),
  },
  {
    id: LicenseUri.CC_BY_SA,
    name: 'CC BY-SA',
    description: i18n.t('licenses.description.cc_by_sa'),
    logo: LicenseImages.ccBySaLogo,
    link: i18n.t('licenses.links.cc_by_sa'),
  },
  {
    id: LicenseUri.CC_BY_ND,
    name: 'CC BY-ND',
    description: i18n.t('licenses.description.cc_by_nd'),
    logo: LicenseImages.ccByNdLogo,
    link: i18n.t('licenses.links.cc_by_nd'),
  },
  {
    id: LicenseUri.CC_BY_NC,
    name: 'CC BY-NC',
    description: i18n.t('licenses.description.cc_by_nc'),
    logo: LicenseImages.ccByNcLogo,
    link: i18n.t('licenses.links.cc_by_nc'),
  },
  {
    id: LicenseUri.CC_BY_NC_SA,
    name: 'CC BY-NC-SA',
    description: i18n.t('licenses.description.cc_by_nc_sa'),
    logo: LicenseImages.ccByNcSaLogo,
    link: i18n.t('licenses.links.cc_by_nc_sa'),
  },
  {
    id: LicenseUri.CC_BY_NC_ND,
    name: 'CC BY-NC-ND',
    description: i18n.t('licenses.description.cc_by_nc_nd'),
    logo: LicenseImages.ccByNcNdLogo,
    link: i18n.t('licenses.links.cc_by_nc_nd'),
  },
  {
    id: LicenseUri.CC0,
    name: 'CC0',
    description: i18n.t('licenses.description.cc0'),
    logo: LicenseImages.cc0Logo,
    link: i18n.t('licenses.links.cc0'),
  },
];

export type AssociatedFileType = 'PublishedFile' | 'UnpublishedFile' | 'UnpublishableFile';

export interface AssociatedFile {
  type: AssociatedFileType;
  identifier: string;
  name: string;
  size: number;
  mimeType: string;
  administrativeAgreement: boolean;
  publisherAuthority: boolean | null;
  embargoDate: Date | null;
  license: string | null;
}

export const emptyFile: AssociatedFile = {
  type: 'UnpublishedFile',
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
  administrativeAgreement: false,
  publisherAuthority: null,
  embargoDate: null,
  license: '',
};

export interface AssociatedLink {
  type: 'AssociatedLink';
  id: string;
  name?: string;
  description?: string;
}

export interface NullAssociatedArtifact {
  type: 'NullAssociatedArtifact';
}

export interface Uppy extends UppyType {
  hasUploadSuccessEventListener?: boolean;
}

export type AssociatedArtifact = AssociatedFile | AssociatedLink | NullAssociatedArtifact;
