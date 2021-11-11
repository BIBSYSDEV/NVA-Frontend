import { Uppy as UppyType } from '@uppy/core';
import * as LicenseImages from '../resources/images/licenses';
import i18n from '../translations/i18n';

export enum LicenseNames {
  CC_BY = 'CC BY',
  CC_BY_SA = 'CC BY-SA',
  CC_BY_ND = 'CC BY-ND',
  CC_BY_NC = 'CC BY-NC',
  CC_BY_NC_SA = 'CC BY-NC-SA',
  CC_BY_NC_ND = 'CC BY-NC-ND',
  CC0 = 'CC0',
  RightsReserved = 'RightsReserved',
}

interface LicenseInfo {
  identifier: LicenseNames;
  description: string;
  logo: string;
  link: string;
}

export const licenses: LicenseInfo[] = [
  {
    identifier: LicenseNames.RightsReserved,
    description: i18n.t('licenses:description.rights_reserved'),
    logo: LicenseImages.rightsReservedLogo,
    link: i18n.t('licenses:links.rights_reserved'),
  },
  {
    identifier: LicenseNames.CC_BY,
    description: i18n.t('licenses:description.cc_by'),
    logo: LicenseImages.ccByLogo,
    link: i18n.t('licenses:links.cc_by'),
  },
  {
    identifier: LicenseNames.CC_BY_SA,
    description: i18n.t('licenses:description.cc_by_sa'),
    logo: LicenseImages.ccBySaLogo,
    link: i18n.t('licenses:links.cc_by_sa'),
  },
  {
    identifier: LicenseNames.CC_BY_ND,
    description: i18n.t('licenses:description.cc_by_nd'),
    logo: LicenseImages.ccByNdLogo,
    link: i18n.t('licenses:links.cc_by_nd'),
  },
  {
    identifier: LicenseNames.CC_BY_NC,
    description: i18n.t('licenses:description.cc_by_nc'),
    logo: LicenseImages.ccByNcLogo,
    link: i18n.t('licenses:links.cc_by_nc'),
  },
  {
    identifier: LicenseNames.CC_BY_NC_SA,
    description: i18n.t('licenses:description.cc_by_nc_sa'),
    logo: LicenseImages.ccByNcSaLogo,
    link: i18n.t('licenses:links.cc_by_nc_sa'),
  },
  {
    identifier: LicenseNames.CC_BY_NC_ND,
    description: i18n.t('licenses:description.cc_by_nc_nd'),
    logo: LicenseImages.ccByNcNdLogo,
    link: i18n.t('licenses:links.cc_by_nc_nd'),
  },
  {
    identifier: LicenseNames.CC0,
    description: i18n.t('licenses:description.cc0'),
    logo: LicenseImages.cc0Logo,
    link: i18n.t('licenses:links.cc0'),
  },
];

interface License {
  type: 'License';
  identifier: LicenseNames;
  labels: {
    [key: string]: string;
  };
  link: string;
}

export interface FileSet {
  type: 'FileSet';
  files: File[];
}

export interface RegistrationFileSet {
  fileSet: FileSet | null;
}

export interface File {
  type: 'File';
  identifier: string;
  name: string;
  size: number;
  mimeType: string;
  administrativeAgreement: boolean;
  publisherAuthority: boolean | null;
  embargoDate: Date | null;
  license: License | null;
}

export const emptyFile: File = {
  type: 'File',
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
  administrativeAgreement: false,
  publisherAuthority: null,
  embargoDate: null,
  license: null,
};

export interface Uppy extends UppyType {
  hasUploadSuccessEventListener?: boolean;
}
