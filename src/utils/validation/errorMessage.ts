import i18n from '../../translations/i18n';

//https://stackoverflow.com/a/62858113
export const ErrorMessage = {
  REQUIRED: i18n.t('common:mandatory'),
  MISSING_AUTHOR: i18n.t('registration:feedback.minimum_one_author'),
  MISSING_EDITOR: i18n.t('registration:feedback.minimum_one_editor'),
  MISSING_FILE: i18n.t('registration:feedback.minimum_one_file'),
  MISSING_SUPERVISOR: i18n.t('registration:feedback.minimum_one_supervisor'),
  INVALID_PAGE_INTERVAL: i18n.t('registration:feedback.invalid_page_interval'),
  INVALID_FORMAT: i18n.t('registration:feedback.invalid_format'),
  INVALID_ISBN: i18n.t('registration:feedback.invalid_isbn'),
  MUST_BE_FUTURE: i18n.t('registration:feedback.date_must_be_in_future'),
  MUST_BE_POSITIVE: i18n.t('registration:feedback.must_be_positive'),
  MUST_BE_MIN_1: i18n.t('registration:feedback.must_be_min_1'),
};

// import i18n from '../../translations/i18n';

// const { t } = i18n;
// //https://stackoverflow.com/a/62858113
// export const ErrorMessage = {
//   // Required: i18n.t('common:mandatory'),

//   Message: {
//     RequiredMessage: t('feedback:validation.message.message_required'),
//   },
//   Registration: {
//     EmbargoDateMustBeFuture: t('feedback:validation.registration.embargo_date_must_be_future'),
//     EmbargoDateInvalid: t('feedback:validation.registration.embargo_date_invalid'),
//     FileVersionRequired: t('feedback:validation.registration.file_version_required'),
//     MinimumOneFile: t('feedback:validation.registration.minimum_one_file'),
//     RequiredAuthor: t('feedback:validation.registration.author_required'),
//     RequiredEditor: t('feedback:validation.registration.supervisor_required'),
//     RequiredSupervisor: t('feedback:validation.registration.editor_required'),
//     RequiredDatePublished: t('feedback:validation.registration.date_published_required'),
//     RequiredTitle: t('feedback:validation.registration.title_required'),
//     RequiredNpi: t('feedback:validation.registration.npi_required'),
//     RequiredFirstName: t('feedback:validation.registration.first_name_required'),
//     RequiredLastName: t('feedback:validation.registration.last_name_required'),
//     RequiredLicense: t('feedback:validation.registration.license_required'),
//     InvalidDatePublished: t('feedback:validation.registration.date_published_invalid'),
//     InvalidIsbn: t('feedback:validation.registration.isbn_invalid'),
//     PagesInvalid: t('feedback:validation.registration.pages_invalid'),
//     PeerReviewRequired: t('feedback:validation.registration.peer_review_required'),

//     RequiredPublisher: t('feedback:'),
//     RequiredType: t('feedback:'),
//     RequiredCorrigendumFor: t('feedback:'),
//     RequiredJournal: t('feedback:'),
//     RequiredMessage: t('feedback:'),

//     INVALID_PAGE_INTERVAL: t('registration:feedback.invalid_page_interval'),
//     INVALID_FORMAT: t('registration:feedback.invalid_format'),
//     INVALID_ISBN: t('registration:feedback.invalid_isbn'),
//     MUST_BE_FUTURE: t('registration:feedback.date_must_be_in_future'),
//     MUST_BE_POSITIVE: t('registration:feedback.must_be_positive'),
//     MUST_BE_MIN_1: t('registration:feedback.must_be_min_1'),
//   },
// };
