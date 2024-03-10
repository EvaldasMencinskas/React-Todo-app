import { useEffect, useRef, useState } from 'react';

export function useDebounce(value, debounceTimeout) {
  const mounted = useRef(false);
  const [state, setState] = useState(value);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }

    const handler = setTimeout(() => setState(value), debounceTimeout);
    return () => clearTimeout(handler);
  }, [value]);

  return state;
}
