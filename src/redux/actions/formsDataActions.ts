import { DescriptionFormData, ReferencesFormData } from '../../types/form.types';

export const UPDATE_DESCRIPTION_FORM_DATA = 'update description form data';
export const UPDATE_REFERENCES_FORM_DATA = 'update references form data';

export const updateDescriptionFormData = (descriptionData: DescriptionFormData): UpdateDescriptionFormData => ({
  type: UPDATE_DESCRIPTION_FORM_DATA,
  descriptionData,
});

interface UpdateDescriptionFormData {
  type: typeof UPDATE_DESCRIPTION_FORM_DATA;
  descriptionData: DescriptionFormData;
}

export const updateReferencesFormData = (referencesData: ReferencesFormData): UpdateReferencesFormData => ({
  type: UPDATE_REFERENCES_FORM_DATA,
  referencesData,
});

interface UpdateReferencesFormData {
  type: typeof UPDATE_REFERENCES_FORM_DATA;
  referencesData: ReferencesFormData;
}

export type FormActions = UpdateDescriptionFormData | UpdateReferencesFormData;
