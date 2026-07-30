import { useEffect, useState } from "react";

import { formatElapsedTime, getElapsedSeconds } from "../utils/time";

type TimerProps = {
  startedAt: string;
  completedAt?: string | null;
};

function Timer({ startedAt, completedAt = null }: TimerProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() =>
    getElapsedSeconds(startedAt, completedAt),
  );

  useEffect(() => {
    let isCurrent = true;

    queueMicrotask(() => {
      if (isCurrent) {
        setElapsedSeconds(getElapsedSeconds(startedAt, completedAt));
      }
    });

    if (completedAt) {
      return () => {
        isCurrent = false;
      };
    }

    const intervalId = window.setInterval(() => {
      setElapsedSeconds(getElapsedSeconds(startedAt));
    }, 1000);

    return () => {
      isCurrent = false;
      window.clearInterval(intervalId);
    };
  }, [startedAt, completedAt]);

  return (
    <div className="inline-flex items-center gap-2.5 rounded-xl border border-navy-900/10 bg-white px-3 py-2 text-sm font-bold text-navy-900 shadow-sm">
      <svg
        aria-hidden="true"
        className="h-4 w-4 text-waldo-600"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 8v4l2.5 1.5M9 3h6M12 5a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
      <span className="sr-only">Tempo decorrido:</span>
      <span className="font-mono tracking-tight">
        {formatElapsedTime(elapsedSeconds)}
      </span>
    </div>
  );
}

export default Timer;
