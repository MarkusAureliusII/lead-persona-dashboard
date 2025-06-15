import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Globaler Hook für persistente Form-States
export function usePersistedState<T>(
  key: string, 
  defaultValue: T,
  options: {
    sessionStorage?: boolean; // false = localStorage, true = sessionStorage
    userSpecific?: boolean;   // true = pro User, false = global
  } = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  
  const { user } = useAuth();
  const { sessionStorage = false, userSpecific = true } = options;
  
  // Erstelle user-spezifischen oder globalen Schlüssel
  const getStorageKey = () => {
    if (userSpecific && user) {
      return `${key}_${user.id}`;
    }
    return key;
  };
  
  // Wähle Storage-Typ
  const storage = sessionStorage ? window.sessionStorage : window.localStorage;
  
  // State mit Lazy Initial Value
  const [state, setState] = useState<T>(() => {
    try {
      const storageKey = getStorageKey();
      const item = storage.getItem(storageKey);
      
      if (item) {
        return JSON.parse(item);
      }
    } catch (error) {
      console.warn(`Failed to load persisted state for key "${key}":`, error);
    }
    
    return defaultValue;
  });
  
  // Ref um zu verhindern, dass setState in useEffect eine Endlosschleife verursacht
  const previousKeyRef = useRef<string>();
  
  // Speichere State automatisch bei Änderungen
  useEffect(() => {
    try {
      const storageKey = getStorageKey();
      
      // Lade neue Daten wenn sich der User oder Key ändert
      if (previousKeyRef.current !== storageKey) {
        const item = storage.getItem(storageKey);
        if (item) {
          setState(JSON.parse(item));
        } else {
          setState(defaultValue);
        }
        previousKeyRef.current = storageKey;
        return;
      }
      
      // Speichere aktuellen State
      storage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn(`Failed to save persisted state for key "${key}":`, error);
    }
  }, [state, key, user?.id, storage, defaultValue]);
  
  // Custom setState function
  const setPersistedState = (value: T | ((prev: T) => T)) => {
    setState(prevState => {
      const newState = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
      return newState;
    });
  };
  
  return [state, setPersistedState];
}

// Spezialisierte Hooks für häufige Use Cases
export function usePersistedForm<T>(formKey: string, defaultValues: T) {
  return usePersistedState(formKey, defaultValues, { 
    sessionStorage: false, 
    userSpecific: true 
  });
}

export function usePersistedSession<T>(sessionKey: string, defaultValues: T) {
  return usePersistedState(sessionKey, defaultValues, { 
    sessionStorage: true, 
    userSpecific: true 
  });
}

export function usePersistedGlobal<T>(globalKey: string, defaultValues: T) {
  return usePersistedState(globalKey, defaultValues, { 
    sessionStorage: false, 
    userSpecific: false 
  });
}