import { ContributorsFormData, DescriptionFormData, ReferencesFormData } from '../../types/form.types';

export const UPDATE_DESCRIPTION_FORM_DATA = 'update description form data';
export const UPDATE_REFERENCES_FORM_DATA = 'update references form data';
export const UPDATE_CONTRIBUTORS_FORM_DATA = 'update contributors form data';

export const updateDescriptionFormData = (descriptionData: DescriptionFormData): UpdateDescriptionFormData => ({
  type: UPDATE_DESCRIPTION_FORM_DATA,
  descriptionData,
});

export const updateReferencesFormData = (referencesData: ReferencesFormData): UpdateReferencesFormData => ({
  type: UPDATE_REFERENCES_FORM_DATA,
  referencesData,
});

export const updateContributorsFormData = (contributorsData: ContributorsFormData): UpdateContributorsFormData => ({
  type: UPDATE_CONTRIBUTORS_FORM_DATA,
  contributorsData,
});

interface UpdateDescriptionFormData {
  type: typeof UPDATE_DESCRIPTION_FORM_DATA;
  descriptionData: DescriptionFormData;
}

interface UpdateReferencesFormData {
  type: typeof UPDATE_REFERENCES_FORM_DATA;
  referencesData: ReferencesFormData;
}

interface UpdateContributorsFormData {
  type: typeof UPDATE_CONTRIBUTORS_FORM_DATA;
  contributorsData: ContributorsFormData;
}

export type FormActions = UpdateDescriptionFormData | UpdateReferencesFormData | UpdateContributorsFormData;
