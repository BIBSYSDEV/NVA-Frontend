import * as LicenseImages from '../resources/images/licenses';
import { Uppy as UppyType, StrictTypes } from '@uppy/core';

export enum LicenseNames {
  CC_BY = 'CC BY',
  CC_BY_SA = 'CC BY-SA',
  CC_BY_ND = 'CC BY-ND',
  CC_BY_NC = 'CC BY-NC',
  CC_BY_NC_SA = 'CC BY-NC-SA',
  CC_BY_NC_ND = 'CC BY-NC-ND',
  CC0 = 'CC0',
}

export interface LicenseInfo {
  identifier: LicenseNames;
  description: string;
  image: any;
}

export const licenses: LicenseInfo[] = [
  {
    identifier: LicenseNames.CC_BY,
    image: LicenseImages.ccByImage,
    description:
      'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
  },
  {
    identifier: LicenseNames.CC_BY_SA,
    image: LicenseImages.ccBySaImage,
    description:
      'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects. ',
  },
  {
    identifier: LicenseNames.CC_BY_ND,
    image: LicenseImages.ccByNdImage,
    description:
      'This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.',
  },
  {
    identifier: LicenseNames.CC_BY_NC,
    image: LicenseImages.ccByNcImage,
    description:
      'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
  },
  {
    identifier: LicenseNames.CC_BY_NC_SA,
    image: LicenseImages.ccByNcSaImage,
    description:
      'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
  },
  {
    identifier: LicenseNames.CC_BY_NC_ND,
    image: LicenseImages.ccByNcNdImage,
    description:
      'This license is the most restrictive of our six main licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.',
  },
  {
    identifier: LicenseNames.CC0,
    image: LicenseImages.cc0Image,
    description:
      'CC0 enables scientists, educators, artists and other creators and owners of copyright- or database-protected content to waive those interests in their works and thereby place them as completely as possible in the public domain, so that others may freely build upon, enhance and reuse the works for any purposes without restriction under copyright or database law.',
  },
];

interface License {
  identifier: LicenseNames;
  labels: {
    [key: string]: string;
  };
  link: string;
  type?: string; // TODO: remove this when fixed in backend
}

export interface FileSet {
  files: File[];
  type?: string; // TODO: remove this when fixed in backend
}

export interface File {
  identifier: string;
  name: string;
  size: number;
  mimeType: string;
  administrativeAgreement: boolean;
  publisherAuthority: boolean;
  embargoDate: Date | null;
  license: License | null;
  type?: string; // TODO: remove this when fixed in backend
}

export const emptyFile: File = {
  type: 'File',
  identifier: '',
  name: '',
  size: 0,
  mimeType: '',
  administrativeAgreement: false,
  publisherAuthority: false,
  embargoDate: null,
  license: null,
};

export interface Uppy extends UppyType<StrictTypes> {
  hasUploadSuccessEventListener?: boolean;
}
