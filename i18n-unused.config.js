module.exports = {
  localesPath: 'src/translations',
  srcPath: 'src',
  translationKeyMatcher: /t\([`"'].*[`"'][\),]|(i18nKey(: )[`"'].*?[`"'])|(i18nKey=[`"'].*?[`"'])/g,
  excludeKey: [
    // Exclude dynamic keys
    'disciplines.',
    'licenses.labels.',
    'project.status.',
    'registration.contributors.types.',
    'registration.status.',
    'privacy.purpose.table.row',
  ],
};
