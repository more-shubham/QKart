import { useState, useCallback } from 'react';

/**
 * Custom hook for toggling boolean state
 * @param initialValue - The initial boolean value
 * @returns A tuple of [value, toggle, setValue]
 */
export function useToggle(initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return [value, toggle, setValue];
}
