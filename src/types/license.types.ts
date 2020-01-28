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

export interface File {
  id: string;
  name: string;
  uploadUrl: string;
  data: {
    size: number;
  };
  administrativeContract?: boolean;
  acceptedVersion?: boolean;
  embargoDate?: Date | null;
  license?: License | null;
}

export const emptyFile: File = {
  id: '',
  name: '',
  uploadUrl: '',
  data: {
    size: 0,
  },
  administrativeContract: false,
  acceptedVersion: true,
  embargoDate: null,
  license: null,
};
