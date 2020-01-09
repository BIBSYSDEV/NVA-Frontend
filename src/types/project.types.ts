export interface CristinProjectType {
  cristin_project_id: string;
  title: { [key: string]: string };
  main_language: string;
  url: string;
}

export interface Project {
  id: string;
  title: { [key: string]: string };
  grantId?: string;
  financedBy?: string;
}
