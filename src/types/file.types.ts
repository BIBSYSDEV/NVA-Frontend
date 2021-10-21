import { StrictTypes, Uppy as UppyType } from '@uppy/core';
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
  buttonImage: string;
  description: string;
  identifier: LicenseNames;
  link: string;
}

export const licenses: LicenseInfo[] = [
  {
    buttonImage: LicenseImages.rightsReservedLogo,
    description: i18n.t('licenses:description.rights_reserved'),
    identifier: LicenseNames.RightsReserved,
    link: i18n.t('licenses:links.rights_reserved'),
  },
  {
    buttonImage: LicenseImages.ccByLogo,
    description: i18n.t('licenses:description.cc_by'),
    identifier: LicenseNames.CC_BY,
    link: i18n.t('licenses:links.cc_by'),
  },
  {
    buttonImage: LicenseImages.ccBySaLogo,
    description: i18n.t('licenses:description.cc_by_sa'),
    identifier: LicenseNames.CC_BY_SA,
    link: i18n.t('licenses:links.cc_by_sa'),
  },
  {
    buttonImage: LicenseImages.ccByNdLogo,
    description: i18n.t('licenses:description.cc_by_nd'),
    identifier: LicenseNames.CC_BY_ND,
    link: i18n.t('licenses:links.cc_by_nd'),
  },
  {
    identifier: LicenseNames.CC_BY_NC,
    buttonImage: LicenseImages.ccByNcLogo,
    description: i18n.t('licenses:description.cc_by_nc'),
    link: i18n.t('licenses:links.cc_by_nc'),
  },
  {
    buttonImage: LicenseImages.ccByNcSaLogo,
    description: i18n.t('licenses:description.cc_by_nc_sa'),
    identifier: LicenseNames.CC_BY_NC_SA,
    link: i18n.t('licenses:links.cc_by_nc_sa'),
  },
  {
    buttonImage: LicenseImages.ccByNcNdLogo,
    description: i18n.t('licenses:description.cc_by_nc_nd'),
    identifier: LicenseNames.CC_BY_NC_ND,
    link: i18n.t('licenses:links.cc_by_nc_nd'),
  },
  {
    buttonImage: LicenseImages.cc0Logo,
    description: i18n.t('licenses:description.cc0'),
    identifier: LicenseNames.CC0,
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

export interface Uppy extends UppyType<StrictTypes> {
  hasUploadSuccessEventListener?: boolean;
}
