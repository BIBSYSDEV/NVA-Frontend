import { CristinProject } from '../../types/project.types';
import { LanguageCodes } from '../../types/language.types';

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

export const getProjectTitleParts = (project: CristinProject, searchTerm: string) => {
  const title = getProjectTitle(project);
  const matchIndex = title.toLocaleLowerCase().indexOf(searchTerm);
  const parts = [
    title.substr(0, matchIndex),
    title.substr(matchIndex, searchTerm.length),
    title.substr(matchIndex + searchTerm.length),
  ];
  return parts;
};
