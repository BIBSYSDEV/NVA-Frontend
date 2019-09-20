export enum ContentType {
  FILE = 'file',
  LINK = 'link',
}

export default interface Content {
  identifier: string;
  name: string;
  size: string;
  time_created: Date;
  type: ContentType;
}
