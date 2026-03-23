import { useEffect, useMemo, useState } from "react";

export function useReferenceClock(referenceDate: Date) {
  const [referenceMs] = useState(() => referenceDate.getTime());
  const [currentMs, setCurrentMs] = useState(referenceMs);

  useEffect(() => {
    const startedAtMs = Date.now();

    const tick = () => {
      const elapsedMs = Date.now() - startedAtMs;
      setCurrentMs(referenceMs + elapsedMs);
    };

    tick();

    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [referenceMs]);

  return useMemo(() => new Date(currentMs), [currentMs]);
}
