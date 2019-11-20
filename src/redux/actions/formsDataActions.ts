import { ResourceDescriptionFormData } from '../../types/form.types';

export const UPDATE_RESOURCE_DESCRIPTION_FORM_DATA = 'update resource description form data';

export const updateResourceDescriptionFormData = (
  resourceDescriptionData: ResourceDescriptionFormData
): UpdateResourceDescriptionFormData => ({
  type: UPDATE_RESOURCE_DESCRIPTION_FORM_DATA,
  resourceDescriptionData,
});

interface UpdateResourceDescriptionFormData {
  type: typeof UPDATE_RESOURCE_DESCRIPTION_FORM_DATA;
  resourceDescriptionData: ResourceDescriptionFormData;
}

export type FormActions = UpdateResourceDescriptionFormData;
