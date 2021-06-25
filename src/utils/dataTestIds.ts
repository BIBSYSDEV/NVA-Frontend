export const dataTestId = {
  projectLandingPage: {
    generalInfoBox: 'general-info',
    participantsAccordion: 'participants-accordion',
    resultsAccordion: 'results-accordion',
    scientificSummaryAccordion: 'scientific-summary-accordion',
  },
  registrationLandingPage: {
    abstractAccordion: 'abstract-accordion',
    authorLink: (id: string) => `presentation-author-link-${id}`,
    backToWizard: 'back-to-wizard-button',
    createDoiButton: 'button-create-doi',
    doiMessageField: 'request-doi-message',
    downloadFileButton: 'button-download-file',
    editButton: 'button-edit-registration',
    filesAccordion: 'files-accordion',
    projectsAccordion: 'projects-accordion',
    projectTitle: 'project-title',
    publishButton: 'button-publish-registration',
    rejectDoiButton: 'button-reject-doi',
    requestDoiButton: 'button-toggle-request-doi',
    requestDoiModal: 'request-doi-modal',
    sendDoiButton: 'button-send-doi-request',
    status: 'public-registration-status',
  },
  registrationWizard: {
    description: {
      addVocabularyButton: 'add-vocabulary-button',
      vocabularyMenuItem: (vocabulary: string) => `vocabulary-menu-item-${vocabulary}`,
      vocabularyRow: (vocabulary: string) => `vocabulary-row-${vocabulary}`,
    },
    files: {
      administrativeAgreement: 'administrative-agreement-checkbox',
      version: 'version-radios',
    },
    resourceType: {
      pagesField: 'pages-field',
      peerReviewed: 'peer-review-field',
      seriesField: 'series-search-field',
      seriesNumber: 'series-number-field',
    },
  },
  myInstitutionUsersPage: {
    usersAdministrators: 'users-administrators',
    usersCurators: 'users-curators',
    usersEditors: 'users-editors',
    usersCreators: 'users-creators',
  },
};
