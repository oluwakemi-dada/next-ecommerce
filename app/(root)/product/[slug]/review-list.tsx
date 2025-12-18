'use client';
import { useState, useEffect } from 'react';
import { Calendar, User } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import { Review } from '@/types';
import ReviewForm from './review-form';

type ReviewListProps = {
  productId: string;
  productSlug: string;
};

const ReviewList = ({ productId, productSlug }: ReviewListProps) => {
  const { data: session } = useSession();
  const userId = session?.user.id;

  const [reviews, setReviews] = useState<Review[]>([]);

  const onReviewSubmitted = () => {};

  return (
    <div className="space-y-4">
      {reviews.length === 0 && <div>No reviews yet</div>}
      {userId ? (
        <ReviewForm
          userId={userId}
          productId={productId}
          onReviewSubmitted={onReviewSubmitted}
        />
      ) : (
        <div>
          Please
          <Link
            className="px-2 text-blue-700"
            href={`/sign-in?callbackUrl=/product/${productSlug}`}
          >
            sign in
          </Link>
          to write a review
        </div>
      )}

      <div className="flex flex-col gap-3"></div>
    </div>
  );
};

export default ReviewList;
