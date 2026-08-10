import { useTranslation } from 'react-i18next';
import {
  ExhibitionProductionSubtype,
  ExhibitionPublicationInstance,
} from '../../../types/publication_types/exhibitionContent.types';
import { PublicPageInfoEntry } from '../PublicPageInfoEntry';

export const PublicPublicationInstanceExhibition = ({
  publicationInstance,
}: {
  publicationInstance: ExhibitionPublicationInstance;
}) => {
  const { t } = useTranslation();
  const { subtype } = publicationInstance;

  const typeString = subtype.type
    ? subtype.type === ExhibitionProductionSubtype.Other && subtype.description
      ? subtype.description
      : t(`registration.resource_type.exhibition_production.subtype.${subtype.type}`)
    : '-';

  return typeString ? (
    <PublicPageInfoEntry title={t('registration.resource_type.type_work')} content={typeString} />
  ) : null;
};
