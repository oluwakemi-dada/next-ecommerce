import { Badge } from '@/components/ui/badge';
import AddToCart from '@/app/(root)/product/[slug]/add-to-cart';
import { Product } from '@/types';

type ProductActionCardProps = {
  product: Product;
};

const ProductActionCard = async ({ product }: ProductActionCardProps) => {
  const outOfStock =
    product.variants.length > 0
      ? product.variants.every((variant) => variant.stock < 1)
      : !product.stock || product.stock < 1;

  return (
    <>
      <div className="flex justify-between">
        {!outOfStock ? (
          <Badge variant="outline">In Stock</Badge>
        ) : (
          <Badge variant="destructive">Out Of Stock</Badge>
        )}
      </div>

      <div className="pt-5">
        <AddToCart product={product} outOfStock={outOfStock} />
      </div>
    </>
  );
};

export default ProductActionCard;
