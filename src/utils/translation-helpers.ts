import i18n from '../translations/i18n';
import { AggregationBucket, LanguageString } from '../types/common.types';

// Map from three letter language to two ("nob" -> "no")
export const getPreferredLanguageCode = (language?: string) => {
  const currentLanguage = language || i18n.language;
  if (currentLanguage === 'nob') {
    return 'nb';
  } else if (currentLanguage === 'nno') {
    return 'nn';
  } else if (currentLanguage === 'nor') {
    return 'no';
  } else {
    return 'en';
  }
};

// Get label based on selected language
export const getLanguageString = (labels?: LanguageString) => {
  if (!labels || Object.keys(labels).length === 0) {
    return '';
  }
  const preferredLanguageCode = getPreferredLanguageCode();

  let translatedString = '';

  switch (preferredLanguageCode) {
    case 'nb':
      translatedString = labels['nb'] ?? labels['no'] ?? labels['nn'] ?? labels['en'];
      break;
    case 'nn':
      translatedString = labels['nn'] ?? labels['no'] ?? labels['nb'] ?? labels['en'];
      break;
    case 'no':
      translatedString = labels['no'] ?? labels['nb'] ?? labels['nn'] ?? labels['en'];
      break;
    case 'en':
      translatedString = labels['en'] ?? labels['no'] ?? labels['nb'] ?? labels['nn'];
      break;
    default:
      translatedString = labels[preferredLanguageCode];
      break;
  }

  if (!translatedString) {
    translatedString = labels[Object.keys(labels)[0]];
  }

  return translatedString;
};

export const getTranslatedAggregatedInstitutionLabel = (aggregationBucket: AggregationBucket) => {
  const labels = aggregationBucket.labels;

  if (labels) {
    const languageString: LanguageString = {
      nb: labels['nb']?.buckets[0]?.key,
      nn: labels['nn']?.buckets[0]?.key,
      en: labels['en']?.buckets[0]?.key,
    };

    const translatedString = getLanguageString(languageString);
    if (translatedString) {
      return translatedString;
    }
  }

  return aggregationBucket.key.split('/').pop();
};
