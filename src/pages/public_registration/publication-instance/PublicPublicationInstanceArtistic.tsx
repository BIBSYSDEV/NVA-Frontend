import { useTranslation } from 'react-i18next';
import { ArtisticType } from '../../../types/publicationFieldNames';
import { ArtisticPublicationInstance } from '../../../types/publication_types/artisticRegistration.types';
import { PublicPageInfoEntry } from '../PublicPageInfoEntry';
import { otherArtisticSubtypes } from './publication-instance-helpers';

export const PublicPublicationInstanceArtistic = ({
  publicationInstance,
}: {
  publicationInstance: ArtisticPublicationInstance;
}) => {
  const { t } = useTranslation();
  const { type, subtype, description, typeDescription } = publicationInstance;

  const i18nTypeBase =
    type === ArtisticType.ArtisticDesign
      ? 'registration.resource_type.artistic.design_type.'
      : type === ArtisticType.ArtisticArchitecture
        ? 'registration.resource_type.artistic.architecture_type.'
        : type === ArtisticType.PerformingArts
          ? 'registration.resource_type.artistic.performing_arts_type.'
          : type === ArtisticType.MovingPicture
            ? 'registration.resource_type.artistic.moving_picture_type.'
            : type === ArtisticType.VisualArts
              ? 'registration.resource_type.artistic.visual_arts_type.'
              : type === ArtisticType.LiteraryArts
                ? 'registration.resource_type.artistic.literary_arts_type.'
                : type === ArtisticType.OtherArtisticOutput
                  ? 'registration.resource_type.artistic.visual_arts_type.'
                  : '';

  const typeString = subtype?.type
    ? otherArtisticSubtypes.includes(subtype.type) && subtype.description
      ? subtype.description
      : t(`${i18nTypeBase}${subtype.type}` as any)
    : typeDescription
      ? typeDescription
      : '';

  return (
    <>
      {typeString && <PublicPageInfoEntry title={t('registration.resource_type.type_work')} content={typeString} />}
      {description && (
        <PublicPageInfoEntry title={t('registration.resource_type.more_info_about_work')} content={description} />
      )}
    </>
  );
};
