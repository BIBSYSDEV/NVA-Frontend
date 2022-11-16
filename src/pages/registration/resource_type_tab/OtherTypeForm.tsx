import { useFormikContext } from 'formik';
import { OtherRegistrationType } from '../../../types/publicationFieldNames';
import { MapRegistration } from '../../../types/publication_types/otherRegistration.types';
import { PublisherField } from './components/PublisherField';

export const OtherTypeForm = () => {
  const { values } = useFormikContext<MapRegistration>();
  const subType = values.entityDescription.reference?.publicationInstance.type;

  return subType === OtherRegistrationType.Map ? <PublisherField /> : null;
};
