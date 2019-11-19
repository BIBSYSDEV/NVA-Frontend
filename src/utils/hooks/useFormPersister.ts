import { useDispatch } from 'react-redux';
import { updateResourceDescriptionFormData } from '../../redux/actions/formActions';
import useLocalStorage from './useLocalStorage';
import { useEffect } from 'react';

export default function useFormPersister(formKey: string, initialValue: object = {}) {
  // Initiate localStorage, with a similar structure for keys as used in Redux
  const lsKey = `forms.${formKey}`;
  const [lsValue, setLsValues] = useLocalStorage(lsKey, initialValue);

  const dispatch = useDispatch();
  // Put potential localStorage data into Redux store
  useEffect(() => {
    if (lsValue && Object.getOwnPropertyNames(lsValue).length > 0) {
      dispatch(updateResourceDescriptionFormData(lsValue));
    }
  }, [dispatch, lsValue]);

  // Update LS. This will trigger useEffect to update Redux store
  const setFormData = (value: any) => {
    setLsValues(value);
  };

  return [lsValue, setFormData];
}
