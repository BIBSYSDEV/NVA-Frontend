import { matchPath } from 'react-router';
import { UrlPathTemplate } from '../urlPaths';

export const checkWhichBasicDataPage = (pathname: string, search?: string) => {
  // Main accordion default pages
  const isOnPersonRegisterPage = !!matchPath(UrlPathTemplate.BasicDataPersonRegister, pathname);
  const isOnInstitutionsPage = !!matchPath(UrlPathTemplate.BasicDataInstitutions, pathname);
  const isOnChannelClaimPage = !!matchPath(UrlPathTemplate.BasicDataPublisherClaims, pathname);
  const isOnCentralImportPage = !!matchPath({ path: UrlPathTemplate.BasicDataCentralImport }, pathname);

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
    isOnCentralImportPage,
    isOnAddEmployeePage,
    isOnNewInstitutionPage,
    isOnCentralImportCandidateLandingPage,
    isOnCentralImportEditPage,
    isOnCentralImportMergePage,
    isOnACentralImportSubPage,
    isOnSerialPublicationClaimsPage,
  };
};
