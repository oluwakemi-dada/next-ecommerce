import { getProductBySlug } from '@/lib/actions/product.actions';
import ReviewList from './review-list';

type ReviewListWrapperProps = {
  productSlug: string;
};

const ReviewListWrapper = async ({ productSlug }: ReviewListWrapperProps) => {
  const product = await getProductBySlug(productSlug);

  return (
    <>
      <h2 className="h2-bold mb-5">Customer Reviews</h2>
      <ReviewList productId={product.id} productSlug={productSlug} />
    </>
  );
};

export default ReviewListWrapper;
