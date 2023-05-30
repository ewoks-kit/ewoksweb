import { useState, useEffect } from 'react';
import type { DataMapping, Inputs } from '../types';

export default function useDebounce(
  value: string | number | DataMapping[] | Inputs[],
  delay: number
) {
  const [debouncedValue, setDebouncedValue] = useState<
    string | number | DataMapping[] | Inputs[]
  >(value);

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
