import { useEffect, type RefObject } from 'react';

export const useClickAway = (
  refs: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: (event: MouseEvent) => void,
) => {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const elements = Array.isArray(refs) ? refs : [refs];
      // A missing ref may belong to portal content that has not mounted yet.
      if (
        elements.some(
          ref => !ref.current || ref.current.contains(event.target as Node),
        )
      ) {
        return;
      }
      handler(event);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [refs, handler]);
};
