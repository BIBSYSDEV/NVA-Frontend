// Persist form data to LocalStorage with a custom hook
import { useState } from 'react';

export default function useLocalStorage(key: string, initialValue: object = {}) {
  // NB! key can have at most one "."
  // First element will be key for localStorage, second element will be key of value object
  // Ex: "form-data.description" will result in "form-data" as LS key, and "description" as key on root of value object
  const [lsKey, objKey] = key.split('.');

  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get value from local storage by key
      let lsItem = window.localStorage.getItem(lsKey);

      // Add value to LS if not yet existing
      if (!lsItem) {
        const lsValue = JSON.stringify(objKey ? { [objKey]: initialValue } : initialValue);
        window.localStorage.setItem(lsKey, lsValue);
        lsItem = lsValue;
      }

      // Parse string value to JSON
      const jsonData = JSON.parse(lsItem);

      // Return relevant part of value
      if (objKey) {
        return jsonData[objKey];
      } else {
        return jsonData;
      }
    } catch (error) {
      // If error return initialValue
      return initialValue;
    }
  });

  // Update value function
  const setValue = (value: any) => {
    try {
      // Update state
      setStoredValue(value);

      // Update localStorage
      const lsValue = window.localStorage.getItem(lsKey);
      if (!lsValue) {
        return;
      }

      let jsonValue = JSON.parse(lsValue);
      if (objKey) {
        jsonValue[objKey] = value;
      } else {
        jsonValue = value;
      }

      window.localStorage.setItem(lsKey, JSON.stringify(jsonValue));
    } catch {
      // Keep using existing values if error occurs
    }
  };

  return [storedValue, setValue];
}
