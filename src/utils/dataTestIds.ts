export const dataTestId = {
  projectLandingPage: {
    generalInfoBox: 'general-info',
    participantsAccordion: 'participants-accordion',
    resultsAccordion: 'results-accordion',
    scientificSummaryAccordion: 'scientific-summary-accordion',
  },
  registrationLandingPage: {
    authorLink: (id: string) => `presentation-author-link-${id}`,
    backToWizard: 'back-to-wizard-button',
    createDoiButton: 'button-create-doi',
    downloadFileButton: 'button-download-file',
    editButton: 'button-edit-registration',
    doiMessageField: 'request-doi-message',
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
      peerReviewed: 'peer-review-field',
    },
  },
  myInstitutionUsersPage: {
    usersAdministrators: 'users-administrators',
    usersCurators: 'users-curators',
    usersEditors: 'users-editors',
    usersCreators: 'users-creators',
  },
};
