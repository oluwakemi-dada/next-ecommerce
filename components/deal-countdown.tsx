'use client';
import { useEffect, useState, memo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';

// Static target date
const TARGET_DATE = new Date('2026-03-14T00:00:00');

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

const DealCountdown = () => {
  const [time, setTime] = useState<ReturnType<typeof calculateTimeRemaining>>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Calculate initial time
    setTime(calculateTimeRemaining(TARGET_DATE));

    intervalRef.current = setInterval(() => {
      const newTime = calculateTimeRemaining(TARGET_DATE);
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
  }, []);

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
    return (
      <section className="my-20 grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-col justify-center gap-2">
          <h3 className="text-3xl font-bold">Deal Has Ended</h3>
          <p>
            This deal is no longer available. Check out our latest promotions!
          </p>

          <div className="mt-2 text-center">
            <Button asChild>
              <Link href="/search">View Products</Link>
            </Button>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src="/images/promo.jpg"
            alt="promotion"
            width={300}
            height={200}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="my-20 grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-3xl font-bold">Deal Of The Month</h3>
        <p>
          Get ready for a shopping experience like never before with our Deals
          of the Month! Every purchase comes with exclusive perks and offers,
          making this month a celebration of savvy choices and amazing deals.
          Don&apos;t miss out! 🎁🛒
        </p>
        <ul className="grid grid-cols-4">
          <StatBox label="Days" value={time.days} />
          <StatBox label="Hours" value={time.hours} />
          <StatBox label="Minutes" value={time.minutes} />
          <StatBox label="Seconds" value={time.seconds} />
        </ul>
        <div className="text-center">
          <Button asChild>
            <Link href="/search">View Products</Link>
          </Button>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src="/images/promo.jpg"
          alt="promotion"
          width={300}
          height={200}
        />
      </div>
    </section>
  );
};

const StatBox = memo(({ label, value }: { label: string; value: number }) => (
  <li className="w-full p-4 text-center">
    <p className="text-3xl font-bold">{value}</p>
    <p>{label}</p>
  </li>
));

StatBox.displayName = 'StatBox';

export default DealCountdown;
