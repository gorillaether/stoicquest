import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing persistent state in localStorage
 *
 * @param {string} key - The key to store the value under in localStorage
 * @param {any} initialValue - The initial value if nothing exists in localStorage
 * @returns {[any, Function]} - A stateful value and a function to update it
 */
const useLocalStorage = (key, initialValue) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValueInternal] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have same API as useState
      // This function will be passed to setStoredValueInternal,
      // which will provide the latest state.
      const valueUpdater = (currentStoredValue) => {
        const valueToStore =
          value instanceof Function ? value(currentStoredValue) : value;

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      };

      // Save state
      setStoredValueInternal(valueUpdater);

    } catch (error) {
      // A more advanced implementation would handle the error case
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, setStoredValueInternal]); // Dependencies for useCallback

  // Listen for changes to this localStorage key in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) { // Check for newValue not being null (item removal)
        try {
          // When local storage changes, update the state
          setStoredValueInternal(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage key "${key}" from storage event:`, error);
          // Optionally, you could set it to initialValue or do nothing
        }
      } else if (e.key === key && e.newValue === null) {
        // Handle item removal if needed, e.g., reset to initialValue
        setStoredValueInternal(initialValue);
         console.log(`localStorage key "${key}" was removed from another tab. Resetting to initial value.`);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener('storage', handleStorageChange);
      return () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, [key, initialValue, setStoredValueInternal]); // Added initialValue and setStoredValueInternal to deps

  return [storedValue, setValue];
};

export default useLocalStorage;