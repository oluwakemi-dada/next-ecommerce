import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import CountdownTimer from './countdown-timer';

// Static target date
const TARGET_DATE = new Date('2026-03-14T00:00:00');

const DealCountdown = () => {
  // Check if deal has ended server-side
  const hasEnded = new Date() >= TARGET_DATE;

  if (hasEnded) {
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
          {/* // eslint-disable-next-line react/jsx-no-undef */}
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
        <CountdownTimer targetDate={TARGET_DATE} />
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

export default DealCountdown;
