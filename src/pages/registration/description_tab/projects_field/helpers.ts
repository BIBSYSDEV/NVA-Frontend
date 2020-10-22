import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { LanguageCodes } from '../../../../types/language.types';
import { BackendTypeNames } from '../../../../types/publication_types/commonRegistration.types';

export const getProjectTitle = (option: CristinProject) => {
  const selectedLanguage = localStorage.getItem('i18nextLng');
  if (selectedLanguage === LanguageCodes.NORWEGIAN_BOKMAL || selectedLanguage === LanguageCodes.NORWEGIAN_NYNORSK) {
    const norwegianTitle = option.titles.find((title) => title.language === 'no')?.title;
    if (norwegianTitle) {
      return norwegianTitle;
    }
  }
  if (selectedLanguage === LanguageCodes.ENGLISH) {
    const englishTitle = option.titles.find((title) => title.language === 'en')?.title;
    if (englishTitle) {
      return englishTitle;
    }
  }
  return option.titles[0].title;
};

export const getTextParts = (text: string, searchTerm: string) => {
  const indexOfMatch = text.toLocaleLowerCase().indexOf(searchTerm);
  const parts =
    indexOfMatch === -1
      ? [text]
      : [
          text.substr(0, indexOfMatch),
          text.substr(indexOfMatch, searchTerm.length),
          text.substr(indexOfMatch + searchTerm.length),
        ];
  return parts;
};

export const convertToResearchProject = (project: CristinProject): ResearchProject => ({
  type: BackendTypeNames.RESEARCH_PROJECT,
  id: project.cristinProjectId,
  name: project.titles[0].title,
  grants: project.fundings.map((funding) => ({
    id: funding.projectCode,
    source: funding.fundingSourceCode,
    type: BackendTypeNames.GRANT,
  })),
  approvals: [],
});

export const convertToCristinProject = (project: ResearchProject): CristinProject => ({
  cristinProjectId: project.id,
  mainLanguage: 'no',
  titles: [{ language: 'no', title: project.name }],
  participants: [],
  institutions: [],
  fundings: [],
});
