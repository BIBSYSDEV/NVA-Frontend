import { FileFieldNames, SpecificFileFieldNames } from '../types/publicationFieldNames';

export const getAllFileFields = (numberOfUploadedFiles: number) => {
  let fieldNames: string[] = Object.values(FileFieldNames);
  if (numberOfUploadedFiles > 0) {
    for (let index = 0; index < numberOfUploadedFiles; index++) {
      for (const fileField of Object.values(SpecificFileFieldNames)) {
        fieldNames.push(`${FileFieldNames.FILE_SET}[${index}].${fileField}`);
      }
    }
  }
  return fieldNames;
};
