// Persist form data to LocalStorage with a custom hook
import { useState } from 'react';

export default function useLocalStorage(key: string, initialValue: object = {}) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let localStorageItem = window.localStorage.getItem(key);

      // Add value to localStorage if not yet existing
      if (!localStorageItem) {
        const localStorageValue = JSON.stringify(initialValue);
        window.localStorage.setItem(key, localStorageValue);
        localStorageItem = localStorageValue;
      }

      const jsonData = JSON.parse(localStorageItem);
      return jsonData;
    } catch {
      return initialValue;
    }
  });

  // Update value function
  const setValue = (value: any) => {
    setStoredValue(value);

    const localStorageValue = window.localStorage.getItem(key);
    if (!localStorageValue) {
      return;
    }

    let jsonValue = JSON.parse(localStorageValue);
    jsonValue = value;
    window.localStorage.setItem(key, JSON.stringify(jsonValue));
  };

  const clearValue = () => {
    window.localStorage.removeItem(key);
  };

  return [storedValue, setValue, clearValue];
}
