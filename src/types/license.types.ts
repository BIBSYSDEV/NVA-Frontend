export default interface License {
  identifier: string;
  code: string;
  description: string;
  description_en?: string;
  description_no?: string;
  issuer: string;
  name: string;
  name_en?: string;
  name_no?: string;
  url: string;
  url_en?: string;
  url_no?: string;
  url_image: string;
  time_created: Date;
}

export interface UppyFileResponse {
  uploadURL: string;
}

export interface File {
  id: string;
  name: string;
  uploadUrl: string;
  data: {
    size: number;
    lastModified: number;
    type: string;
  };
  administrativeContract?: boolean;
  isPublished?: boolean | null;
  embargoDate?: Date | null;
  license?: License | null;
}

export const emptyFile: File = {
  id: '',
  name: '',
  uploadUrl: '',
  data: {
    size: 0,
    lastModified: 0,
    type: '',
  },
  administrativeContract: false,
  isPublished: null,
  embargoDate: null,
  license: null,
};
