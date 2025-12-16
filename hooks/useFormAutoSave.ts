import { useState, useEffect, useCallback } from 'react';

export const useFormAutoSave = <T extends object>(storageKey: string, data: T, isDirty: boolean) => {
  const [savedData, setSavedData] = useState<T | null>(null);

  // On mount, check for saved data in localStorage
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(storageKey);
      if (item) {
        setSavedData(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading from localStorage for key "${storageKey}":`, error);
    }
  }, [storageKey]);

  // Auto-save data to localStorage when it changes and the form is dirty
  useEffect(() => {
    if (isDirty) {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.error(`Error writing to localStorage for key "${storageKey}":`, error);
      }
    }
  }, [storageKey, data, isDirty]);

  const clearSavedData = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
      setSavedData(null);
    } catch (error) {
      console.error(`Error clearing localStorage for key "${storageKey}":`, error);
    }
  }, [storageKey]);

  return { savedData, clearSavedData };
};
