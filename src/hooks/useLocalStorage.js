// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react';

/**
 * A custom hook that works exactly like useState, 
 * but saves and loads the value from the browser's localStorage!
 */
export function useLocalStorage(key, initialValue) {
  // Set up the state, checking localStorage for an existing value first
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Whenever the key or value changes, update localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}