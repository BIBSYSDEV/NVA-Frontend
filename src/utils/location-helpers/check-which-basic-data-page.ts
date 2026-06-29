import { matchPath } from 'react-router';
import { UrlPathTemplate } from '../urlPaths';

export const checkWhichBasicDataPage = (rawPathname: string, search?: string) => {
  const pathname = rawPathname.replace(/\/$/, '');
  // Main accordion default pages
  const isOnPersonRegisterPage = !!matchPath(UrlPathTemplate.BasicDataPersonRegister, pathname);
  const isOnInstitutionsPage = !!matchPath(UrlPathTemplate.BasicDataInstitutions, pathname);
  const isOnChannelClaimPage = !!matchPath(UrlPathTemplate.BasicDataPublisherClaims, pathname);

  // Person register subpages
  const isOnAddEmployeePage = !!matchPath(UrlPathTemplate.BasicDataAddEmployee, pathname);

  // Institution subpages
  const isOnNewInstitutionPage = pathname === UrlPathTemplate.BasicDataInstitutions && search === '?id=new';

  // Central import subpages
  const isOnCentralImportCandidateLandingPage = !!matchPath(UrlPathTemplate.BasicDataCentralImportCandidate, pathname);
  const isOnCentralImportEditPage = !!matchPath(UrlPathTemplate.BasicDataCentralImportCandidateWizard, pathname);
  const isOnCentralImportMergePage = !!matchPath(UrlPathTemplate.BasicDataCentralImportCandidateMerge, pathname);
  const isOnACentralImportSubPage =
    isOnCentralImportCandidateLandingPage || isOnCentralImportEditPage || isOnCentralImportMergePage;

  // Channel ownership subpages
  const isOnSerialPublicationClaimsPage = !!matchPath(UrlPathTemplate.BasicDataSerialPublicationClaims, pathname);

  return {
    isOnPersonRegisterPage,
    isOnInstitutionsPage,
    isOnChannelClaimPage,
    isOnAddEmployeePage,
    isOnNewInstitutionPage,
    isOnCentralImportCandidateLandingPage,
    isOnCentralImportEditPage,
    isOnCentralImportMergePage,
    isOnACentralImportSubPage,
    isOnSerialPublicationClaimsPage,
  };
};
