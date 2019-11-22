export interface CristinProjectTitleType {
  en: string;
  no: string;
}

export default interface CristinProjectType {
  cristin_project_id: string;
  title: CristinProjectTitleType;
  main_language: string;
  url: string;
}
