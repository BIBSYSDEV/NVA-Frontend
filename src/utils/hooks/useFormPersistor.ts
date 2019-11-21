import { useDispatch } from 'react-redux';
import { updateResourceDescriptionFormData } from '../../redux/actions/formsDataActions';
import useLocalStorage from './useLocalStorage';
import { useEffect } from 'react';

export default function useFormPersistor(formKey: string, initialValue: object = {}) {
  // Initiate locaStorage with a similar structure for keys as used in Redux
  const localStorageKey = `formsData.${formKey}`;
  const [localStorageValue, setLocalStorageValues] = useLocalStorage(localStorageKey, initialValue);

  const dispatch = useDispatch();

  // Put potential localStorage data into Redux store
  useEffect(() => {
    if (localStorageValue && Object.getOwnPropertyNames(localStorageValue).length > 0) {
      dispatch(updateResourceDescriptionFormData(localStorageValue));
    }
  }, [dispatch, localStorageValue]);

  // Update LS. This will trigger useEffect to update Redux store
  const setFormData = (value: any) => {
    setLocalStorageValues(value);
  };

  return [localStorageValue, setFormData];
}
