import { useState, useEffect } from 'react';

/** True only after `isLoading` has been true continuously for `delayMs` (avoids flash on fast responses). */
export function useLoadingNoticeAfterDelay(isLoading, delayMs = 400) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [isLoading, delayMs]);

  return show;
}
