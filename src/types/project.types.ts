export interface CristinProjectType {
  cristin_project_id: string;
  title: { [key: string]: string };
  main_language: string;
  url: string;
}

export interface NormalizedProjectType {
  id: string;
  title: { [key: string]: string };
}
