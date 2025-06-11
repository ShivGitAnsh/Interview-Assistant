// components/TimeCounter.jsx
'use client';
import React, { useEffect, useState } from 'react';

function formatTime(seconds) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

const TimeCounter = ({ duration }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => {
        if (prev < duration) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [duration]);

  return <span>{formatTime(elapsed)}</span>;
};

export default TimeCounter;
