import { ContributorsFormData, DescriptionFormData, ReferenceFormData } from '../../types/form.types';

export const UPDATE_DESCRIPTION_FORM_DATA = 'update description form data';
export const UPDATE_CONTRIBUTORS_FORM_DATA = 'update contributors form data';
export const UPDATE_REFERENCE_FORM_DATA = 'update reference form data';

export const updateDescriptionFormData = (descriptionData: DescriptionFormData): UpdateDescriptionFormData => ({
  type: UPDATE_DESCRIPTION_FORM_DATA,
  descriptionData,
});

export const updateContributorsFormData = (contributorsData: ContributorsFormData): UpdateContributorsFormData => ({
  type: UPDATE_CONTRIBUTORS_FORM_DATA,
  contributorsData,
});

export const updateReferenceFormData = (referenceData: ReferenceFormData): UpdateReferenceFormData => ({
  type: UPDATE_REFERENCE_FORM_DATA,
  referenceData,
});

interface UpdateDescriptionFormData {
  type: typeof UPDATE_DESCRIPTION_FORM_DATA;
  descriptionData: DescriptionFormData;
}

interface UpdateContributorsFormData {
  type: typeof UPDATE_CONTRIBUTORS_FORM_DATA;
  contributorsData: ContributorsFormData;
}

interface UpdateReferenceFormData {
  type: typeof UPDATE_REFERENCE_FORM_DATA;
  referenceData: ReferenceFormData;
}

export type FormActions = UpdateDescriptionFormData | UpdateContributorsFormData | UpdateReferenceFormData;
