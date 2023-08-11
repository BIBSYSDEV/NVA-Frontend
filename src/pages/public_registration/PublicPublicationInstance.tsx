import { Typography } from '@mui/material';
import { hyphenate as hyphenateIsbn } from 'isbn-utils';
import { useTranslation } from 'react-i18next';
import i18n from '../../translations/i18n';
import { ArtisticType } from '../../types/publicationFieldNames';
import { ArtisticPublicationInstance, DesignType } from '../../types/publication_types/artisticRegistration.types';
import { BookPublicationInstance } from '../../types/publication_types/bookRegistration.types';
import { ChapterPublicationInstance } from '../../types/publication_types/chapterRegistration.types';
import { DegreePublicationInstance } from '../../types/publication_types/degreeRegistration.types';
import {
  ExhibitionProductionSubtype,
  ExhibitionPublicationInstance,
} from '../../types/publication_types/exhibitionContent.types';
import { JournalPublicationInstance } from '../../types/publication_types/journalRegistration.types';
import { PagesMonograph, PagesRange } from '../../types/publication_types/pages.types';
import { ReportPublicationInstance } from '../../types/publication_types/reportRegistration.types';

const getPageInterval = (pages: PagesRange | null) => {
  return pages?.begin || pages?.end
    ? pages.begin === pages.end
      ? `${i18n.t('registration.resource_type.page')} ${pages.begin}`
      : `${i18n.t('registration.resource_type.page')} ${pages.begin ?? '?'}-${pages.end ?? '?'}`
    : '';
};

export const PublicPublicationInstanceJournal = ({
  publicationInstance,
}: {
  publicationInstance: JournalPublicationInstance;
}) => {
  const { t } = useTranslation();
  const { articleNumber, issue, pages, volume } = publicationInstance;
  const pagesInterval = getPageInterval(pages);

  const fieldTexts = [];
  if (volume) {
    fieldTexts.push(`${t('registration.resource_type.volume')} ${volume}`);
  }
  if (issue) {
    fieldTexts.push(`${t('registration.resource_type.issue')} ${issue}`);
  }
  if (pagesInterval) {
    fieldTexts.push(pagesInterval);
  }
  if (articleNumber) {
    fieldTexts.push(`${t('registration.resource_type.article_number')} ${articleNumber}`);
  }

  return <Typography>{fieldTexts.join(', ')}</Typography>;
};

export const PublicPublicationInstanceBook = ({
  publicationInstance,
}: {
  publicationInstance: BookPublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};

export const PublicPublicationInstanceDegree = ({
  publicationInstance,
}: {
  publicationInstance: DegreePublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};

export const PublicPublicationInstanceReport = ({
  publicationInstance,
}: {
  publicationInstance: ReportPublicationInstance;
}) => {
  const { pages } = publicationInstance;

  return <PublicTotalPagesContent pages={pages} />;
};

export const PublicPublicationInstanceChapter = ({
  publicationInstance,
}: {
  publicationInstance: ChapterPublicationInstance;
}) => {
  const { pages } = publicationInstance;
  const pagesInterval = getPageInterval(pages);

  return pagesInterval ? <Typography>{pagesInterval}</Typography> : null;
};

export const PublicPublicationInstanceArtistic = ({
  publicationInstance,
}: {
  publicationInstance: ArtisticPublicationInstance;
}) => {
  const { t } = useTranslation();
  const { type, subtype, description } = publicationInstance;

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
      : '';

  const typeString = subtype?.type
    ? subtype.type === DesignType.Other && subtype.description
      ? subtype.description
      : t(`${i18nTypeBase}${subtype.type}` as any)
    : '';

  return (
    <>
      {typeString && (
        <Typography>
          {t('registration.resource_type.type_work')}: {typeString}
        </Typography>
      )}
      {description && <Typography>{description}</Typography>}
    </>
  );
};

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
    <Typography>
      {t('registration.resource_type.type_work')}: {typeString}
    </Typography>
  ) : null;
};

const PublicTotalPagesContent = ({ pages }: { pages: PagesMonograph | null }) => {
  const { t } = useTranslation();

  return pages?.pages ? (
    <Typography>
      {t('registration.resource_type.number_of_pages')}: {pages.pages}
    </Typography>
  ) : null;
};

export const PublicIsbnContent = ({ isbnList }: { isbnList?: string[] }) => {
  const { t } = useTranslation();

  return isbnList && isbnList.length > 0 ? (
    <Typography>
      {t('registration.resource_type.isbn')}:{' '}
      {isbnList
        .filter((isbn) => isbn)
        .map((isbn) => hyphenateIsbn(isbn))
        .join(', ')}
    </Typography>
  ) : null;
};
