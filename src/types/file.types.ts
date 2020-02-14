import * as LicenseImages from '../resources/images/licenses';
import { Uppy as UppyType } from '@uppy/react/src/CommonTypes';

export interface License {
  name: string;
  description: string;
  image: any;
}

export const licenses: License[] = [
  {
    name: 'CC BY',
    image: LicenseImages.ccByImage,
    description:
      'This license lets others distribute, remix, adapt, and build upon your work, even commercially, as long as they credit you for the original creation. This is the most accommodating of licenses offered. Recommended for maximum dissemination and use of licensed materials.',
  },
  {
    name: 'CC BY-SA',
    image: LicenseImages.ccBySaImage,
    description:
      'This license lets others remix, adapt, and build upon your work even for commercial purposes, as long as they credit you and license their new creations under the identical terms. This license is often compared to “copyleft” free and open source software licenses. All new works based on yours will carry the same license, so any derivatives will also allow commercial use. This is the license used by Wikipedia, and is recommended for materials that would benefit from incorporating content from Wikipedia and similarly licensed projects. ',
  },
  {
    name: 'CC BY-ND',
    image: LicenseImages.ccByNdImage,
    description:
      'This license lets others reuse the work for any purpose, including commercially; however, it cannot be shared with others in adapted form, and credit must be provided to you.',
  },
  {
    name: 'CC BY-NC',
    image: LicenseImages.ccByNcImage,
    description:
      'This license lets others remix, adapt, and build upon your work non-commercially, and although their new works must also acknowledge you and be non-commercial, they don’t have to license their derivative works on the same terms.',
  },
  {
    name: 'CC BY-NC-SA',
    image: LicenseImages.ccByNcSaImage,
    description:
      'This license lets others remix, adapt, and build upon your work non-commercially, as long as they credit you and license their new creations under the identical terms.',
  },
  {
    name: 'CC BY-NC-ND',
    image: LicenseImages.ccByNcNdImage,
    description:
      'This license is the most restrictive of our six main licenses, only allowing others to download your works and share them with others as long as they credit you, but they can’t change them in any way or use them commercially.',
  },
  {
    name: 'CC0',
    image: LicenseImages.cc0Image,
    description:
      'CC0 enables scientists, educators, artists and other creators and owners of copyright- or database-protected content to waive those interests in their works and thereby place them as completely as possible in the public domain, so that others may freely build upon, enhance and reuse the works for any purposes without restriction under copyright or database law.',
  },
];

export interface File {
  id: string;
  name: string;
  preview?: string;
  data: {
    size: number;
    lastModified?: number;
    type: string;
  };
  administrativeContract?: boolean;
  isPublished?: boolean | null;
  embargoDate?: Date | null;
  license?: string;
}

export const emptyFile: File = {
  id: '',
  name: '',
  preview: '',
  data: {
    size: 0,
    lastModified: 0,
    type: '',
  },
  administrativeContract: false,
  isPublished: null,
  embargoDate: null,
  license: '',
};

export interface Uppy extends UppyType {
  hasUploadSuccessEventListener?: boolean;
}
