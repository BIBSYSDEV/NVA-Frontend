import { Box } from '@mui/material';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { LandingPageAccordion } from '../../../components/landing_page/LandingPageAccordion';
import { OpenInNewLink } from '../../../components/OpenInNewLink';
import { AssociatedLink } from '../../../types/associatedArtifact.types';
import { dataTestId } from '../../../utils/dataTestIds';

interface AssociatedLinksLandingPageAccordionProps {
  associatedLinks: AssociatedLink[];
}

export const AssociatedLinksLandingPageAccordion = ({ associatedLinks }: AssociatedLinksLandingPageAccordionProps) => {
  const { t } = useTranslation();

  if (!associatedLinks || associatedLinks.length === 0) {
    return null;
  }

  return (
    <LandingPageAccordion
      dataTestId={dataTestId.registrationLandingPage.otherLinksAccordion}
      defaultExpanded
      heading={t('common.other_links')}>
      <dl>
        {associatedLinks.map((link) => (
          <Box key={link.id} sx={{ display: 'flex', gap: '0.5rem' }}>
            <Box component="dt" sx={{ fontWeight: 'bold' }}>
              {getAssociatedLinkRelationTitle(t, link.relation)}:
            </Box>
            <Box component="dd" sx={{ m: 0 }}>
              <OpenInNewLink href={link.id}>{link.id}</OpenInNewLink>
            </Box>
          </Box>
        ))}
      </dl>
    </LandingPageAccordion>
  );
};

export const getAssociatedLinkRelationTitle = (t: TFunction, relation: AssociatedLink['relation']) => {
  switch (relation) {
    case 'dataset':
      return t('registration.publication_types.DataSet');
    case 'mention':
      return t('common.mention');
    case 'sameAs':
      return t('common.full_text');
    case 'metadataSource':
      return t('common.metadata_source');
    default:
      return t('common.unknown');
  }
};
