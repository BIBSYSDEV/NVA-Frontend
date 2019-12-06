import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { updateDescriptionFormData, updateReferenceFormData } from '../../redux/actions/formsDataActions';
import useLocalStorage from './useLocalStorage';

export default function useFormPersistor(formKey: string, initialValue: object = {}) {
  // Initiate locaStorage with a similar structure for keys as used in Redux
  const localStorageKey = formKey;
  const [localStorageValue, setLocalStorageValue, clearLocalStorageValue] = useLocalStorage(
    localStorageKey,
    initialValue
  );

  const dispatch = useDispatch();

  // Put potential localStorage data into Redux store
  useEffect(() => {
    if (localStorageValue && Object.getOwnPropertyNames(localStorageValue).length > 0) {
      switch (formKey) {
        case 'publicationDescription':
          dispatch(updateDescriptionFormData(localStorageValue));
          break;
        case 'publicationReference':
          dispatch(updateReferenceFormData(localStorageValue));
          break;
        default:
          break;
      }
    }
  }, [dispatch, localStorageValue, formKey]);

  // Update LS. This will trigger useEffect to update Redux store
  const setFormData = (value: any) => {
    setLocalStorageValue(value);
  };

  return [localStorageValue, setFormData, clearLocalStorageValue];
}
