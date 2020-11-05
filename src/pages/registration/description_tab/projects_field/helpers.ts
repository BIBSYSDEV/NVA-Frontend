import i18n from '../../../../translations/i18n';
import { LanguageCodes } from '../../../../types/language.types';
import { CristinProject, ResearchProject } from '../../../../types/project.types';
import { BackendTypeNames } from '../../../../types/publication_types/commonRegistration.types';

export const getLanguageCodeForInstitution = () => {
  const currentLanguage = i18n.language;
  if (currentLanguage === LanguageCodes.NORWEGIAN_BOKMAL || currentLanguage === LanguageCodes.NORWEGIAN_NYNORSK) {
    return 'nb';
  } else {
    return 'en';
  }
};

export const getProjectTitle = (option: CristinProject): string => {
  const selectedLanguage = i18n.language;
  if (selectedLanguage === LanguageCodes.NORWEGIAN_BOKMAL) {
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
