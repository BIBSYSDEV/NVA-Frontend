import * as LicenseImages from '../resources/images/licenses';
import { Uppy as UppyType, StrictTypes } from '@uppy/core';
import { BackendType, BackendTypeNames } from './publication.types';
import i18n from '../translations/i18n';

export enum LicenseNames {
  CC_BY = 'CC BY',
  CC_BY_SA = 'CC BY-SA',
  CC_BY_ND = 'CC BY-ND',
  CC_BY_NC = 'CC BY-NC',
  CC_BY_NC_SA = 'CC BY-NC-SA',
  CC_BY_NC_ND = 'CC BY-NC-ND',
  CC0 = 'CC0',
}

interface LicenseInfo {
  identifier: LicenseNames;
  label: string;
  description: string;
  image: any;
  buttonImage: any;
}

export const licenses: LicenseInfo[] = [
  {
    identifier: LicenseNames.CC_BY,
    label: i18n.t('licenses:labels.cc_by'),
    image: LicenseImages.ccByImage,
    buttonImage: LicenseImages.ccByButton,
    description: i18n.t('licenses:description.cc_by'),
  },
  {
    identifier: LicenseNames.CC_BY_SA,
    label: i18n.t('licenses:labels.cc_by_sa'),
    image: LicenseImages.ccBySaImage,
    buttonImage: LicenseImages.ccBySaButton,
    description: i18n.t('licenses:description.cc_by_sa'),
  },
  {
    identifier: LicenseNames.CC_BY_ND,
    label: i18n.t('licenses:labels.cc_by_nd'),
    image: LicenseImages.ccByNdImage,
    buttonImage: LicenseImages.ccByNdButton,
    description: i18n.t('licenses:description.cc_by_nd'),
  },
  {
    identifier: LicenseNames.CC_BY_NC,
    label: i18n.t('licenses:labels.cc_by_nc'),
    image: LicenseImages.ccByNcImage,
    buttonImage: LicenseImages.ccByNcButton,
    description: i18n.t('licenses:description.cc_by_nc'),
  },
  {
    identifier: LicenseNames.CC_BY_NC_SA,
    label: i18n.t('licenses:labels.cc_by_nc_sa'),
    image: LicenseImages.ccByNcSaImage,
    buttonImage: LicenseImages.ccByNcSaButton,
    description: i18n.t('licenses:description.cc_by_nc_sa'),
  },
  {
    identifier: LicenseNames.CC_BY_NC_ND,
    label: i18n.t('licenses:labels.cc_by_nc_nd'),
    image: LicenseImages.ccByNcNdImage,
    buttonImage: LicenseImages.ccByNcNdButton,
    description: i18n.t('licenses:description.cc_by_nc_nd'),
  },
  {
    identifier: LicenseNames.CC0,
    label: i18n.t('licenses:labels.cc0'),
    image: LicenseImages.cc0Image,
    buttonImage: LicenseImages.cc0Button,
    description: i18n.t('licenses:description.cc0'),
  },
];

interface License extends BackendType {
  identifier: LicenseNames;
  labels: {
    [key: string]: string;
  };
  link: string;
}

export interface FileSet extends BackendType {
  files: File[];
}

export interface File extends BackendType {
  identifier: string;
  name: string;
  size: number;
  mimeType: string;
  administrativeAgreement: boolean;
  publisherAuthority: boolean;
  embargoDate: Date | null;
  license: License | null;
}

export const emptyFile: File = {
  type: BackendTypeNames.FILE,
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
  administrativeAgreement: false,
  publisherAuthority: false,
  embargoDate: null,
  license: null,
};

export const emptyFileSet: FileSet = {
  type: BackendTypeNames.FILE_SET,
  files: [],
};

export interface Uppy extends UppyType<StrictTypes> {
  hasUploadSuccessEventListener?: boolean;
}
