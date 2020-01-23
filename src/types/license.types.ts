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
  uploadURL: string;
  data: {
    size: number;
  };
}
