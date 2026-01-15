'use client';
import { memo, useEffect, useRef, useState } from 'react';

// Calculate the time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const currentTime = new Date();
  const timeDifference = Math.max(Number(targetDate) - Number(currentTime), 0);

  return {
    days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
    hours: Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    ),
    minutes: Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((timeDifference % (1000 * 60)) / 1000),
  };
};

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Calculate initial time
    setTime(calculateTimeRemaining(targetDate));

    intervalRef.current = setInterval(() => {
      const newTime = calculateTimeRemaining(targetDate);
      setTime(newTime);

      if (
        newTime.days === 0 &&
        newTime.hours === 0 &&
        newTime.minutes === 0 &&
        newTime.seconds === 0
      ) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [targetDate]);

  if (!time) {
    return (
      <section className="my-20 grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-3xl font-bold">Loading Countdown...</h3>
        </div>
      </section>
    );
  }

  if (
    time.days === 0 &&
    time.hours === 0 &&
    time.minutes === 0 &&
    time.seconds === 0
  ) {
    return null;
  }

  return (
    <ul className="grid grid-cols-4">
      <StatBox label="Days" value={time.days} />
      <StatBox label="Hours" value={time.hours} />
      <StatBox label="Minutes" value={time.minutes} />
      <StatBox label="Seconds" value={time.seconds} />
    </ul>
  );
};

const StatBox = memo(({ label, value }: { label: string; value: number }) => (
  <li className="w-full p-4 text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
));

StatBox.displayName = 'StatBox';

export default CountdownTimer;
