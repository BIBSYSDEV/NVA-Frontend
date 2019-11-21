// Persist form data to LocalStorage with a custom hook
import { useState } from 'react';

export default function useLocalStorage(key: string, initialValue: object = {}) {
  // NB! key can have at most one ".": First element will be key for localStorage, second element will be key of value object
  // Ex: "formsData.resourceDescription" will result in "formsData" as localStorage key, and "resourceDescription" as key on root of value object
  const [localStorageKey, objectKey] = key.split('.');

  const [storedValue, setStoredValue] = useState(() => {
    try {
      let localStorageItem = window.localStorage.getItem(localStorageKey);

      // Add value to localStorage if not yet existing
      if (!localStorageItem) {
        const localStorageValue = JSON.stringify(objectKey ? { [objectKey]: initialValue } : initialValue);
        window.localStorage.setItem(localStorageKey, localStorageValue);
        localStorageItem = localStorageValue;
      }

      const jsonData = JSON.parse(localStorageItem);

      // Return relevant part of value
      if (objectKey) {
        return jsonData[objectKey];
      } else {
        return jsonData;
      }
    } catch {
      return initialValue;
    }
  });

  // Update value function
  const setValue = (value: any) => {
    setStoredValue(value);

    const localStorageValue = window.localStorage.getItem(localStorageKey);
    if (!localStorageValue) {
      return;
    }

    let jsonValue = JSON.parse(localStorageValue);

    // Update correct part of value
    if (objectKey) {
      jsonValue[objectKey] = value;
    } else {
      jsonValue = value;
    }

    window.localStorage.setItem(localStorageKey, JSON.stringify(jsonValue));
  };

  const clearValue = () => {
    setValue(initialValue);
  };

  return [storedValue, setValue, clearValue];
}
