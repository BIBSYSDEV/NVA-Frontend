import { StrictTypes, Uppy as UppyType } from '@uppy/core';
import * as LicenseImages from '../resources/images/licenses';
import i18n from '../translations/i18n';

export enum LicenseNames {
  CC = 'CC',
  CC_BY = 'CC BY',
  CC_BY_SA = 'CC BY-SA',
  CC_BY_ND = 'CC BY-ND',
  CC_BY_NC = 'CC BY-NC',
  CC_BY_NC_SA = 'CC BY-NC-SA',
  CC_BY_NC_ND = 'CC BY-NC-ND',
  CC0 = 'CC0',
}

interface LicenseInfo {
  buttonImage: string;
  description: string;
  identifier: LicenseNames;
  image: string;
  label: string;
  link: string;
}

export const licenses: LicenseInfo[] = [
  {
    buttonImage: LicenseImages.rightsReservedButton,
    description: i18n.t('licenses:description.cc'),
    identifier: i18n.t('licenses:labels.cc'),
    image: LicenseImages.ccImage,
    label: i18n.t('licenses:labels.cc'),
    link: i18n.t('licenses:links.cc'),
  },
  {
    buttonImage: LicenseImages.ccByButton,
    description: i18n.t('licenses:description.cc_by'),
    identifier: LicenseNames.CC_BY,
    image: LicenseImages.ccByImage,
    label: i18n.t('licenses:labels.cc_by'),
    link: i18n.t('licenses:links.cc_by'),
  },
  {
    buttonImage: LicenseImages.ccBySaButton,
    description: i18n.t('licenses:description.cc_by_sa'),
    identifier: LicenseNames.CC_BY_SA,
    image: LicenseImages.ccBySaImage,
    label: i18n.t('licenses:labels.cc_by_sa'),
    link: i18n.t('licenses:links.cc_by_sa'),
  },
  {
    buttonImage: LicenseImages.ccByNdButton,
    description: i18n.t('licenses:description.cc_by_nd'),
    identifier: LicenseNames.CC_BY_ND,
    image: LicenseImages.ccByNdImage,
    label: i18n.t('licenses:labels.cc_by_nd'),
    link: i18n.t('licenses:links.cc_by_nd'),
  },
  {
    identifier: LicenseNames.CC_BY_NC,
    label: i18n.t('licenses:labels.cc_by_nc'),
    image: LicenseImages.ccByNcImage,
    buttonImage: LicenseImages.ccByNcButton,
    description: i18n.t('licenses:description.cc_by_nc'),
    link: i18n.t('licenses:links.cc_by_nc'),
  },
  {
    buttonImage: LicenseImages.ccByNcSaButton,
    description: i18n.t('licenses:description.cc_by_nc_sa'),
    identifier: LicenseNames.CC_BY_NC_SA,
    image: LicenseImages.ccByNcSaImage,
    label: i18n.t('licenses:labels.cc_by_nc_sa'),
    link: i18n.t('licenses:links.cc_by_nc_sa'),
  },
  {
    buttonImage: LicenseImages.ccByNcNdButton,
    description: i18n.t('licenses:description.cc_by_nc_nd'),
    identifier: LicenseNames.CC_BY_NC_ND,
    image: LicenseImages.ccByNcNdImage,
    label: i18n.t('licenses:labels.cc_by_nc_nd'),
    link: i18n.t('licenses:links.cc_by_nc_nd'),
  },
  {
    buttonImage: LicenseImages.cc0Button,
    description: i18n.t('licenses:description.cc0'),
    identifier: LicenseNames.CC0,
    image: LicenseImages.cc0Image,
    label: i18n.t('licenses:labels.cc0'),
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
