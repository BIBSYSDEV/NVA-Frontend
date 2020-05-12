import * as LicenseImages from '../resources/images/licenses';
import { Uppy as UppyType, StrictTypes } from '@uppy/core';
import { BackendType, BackendTypeNames } from './publication.types';

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
    label: 'Attribution 4.0 International (CC BY 4.0)',
    image: LicenseImages.ccByImage,
    buttonImage: LicenseImages.ccByButton,
    description:
      'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
  },
  {
    identifier: LicenseNames.CC_BY_SA,
    label: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
    image: LicenseImages.ccBySaImage,
    buttonImage: LicenseImages.ccBySaButton,
    description:
      'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects. ',
  },
  {
    identifier: LicenseNames.CC_BY_ND,
    label: 'Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)',
    image: LicenseImages.ccByNdImage,
    buttonImage: LicenseImages.ccByNdButton,
    description:
      'This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.',
  },
  {
    identifier: LicenseNames.CC_BY_NC,
    label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
    image: LicenseImages.ccByNcImage,
    buttonImage: LicenseImages.ccByNcButton,
    description:
      'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
  },
  {
    identifier: LicenseNames.CC_BY_NC_SA,
    label: 'Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)',
    image: LicenseImages.ccByNcSaImage,
    buttonImage: LicenseImages.ccByNcSaButton,
    description:
      'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
  },
  {
    identifier: LicenseNames.CC_BY_NC_ND,
    label: 'Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)',
    image: LicenseImages.ccByNcNdImage,
    buttonImage: LicenseImages.ccByNcNdButton,
    description:
      'This license is the most restrictive of our six main licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.',
  },
  {
    identifier: LicenseNames.CC0,
    label: 'CC 0',
    image: LicenseImages.cc0Image,
    buttonImage: LicenseImages.cc0Button,
    description:
      'CC0 enables scientists, educators, artists and other creators and owners of copyright- or database-protected content to waive those interests in their works and thereby place them as completely as possible in the public domain, so that others may freely build upon, enhance and reuse the works for any purposes without restriction under copyright or database law.',
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
