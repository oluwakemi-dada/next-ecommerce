import { Badge } from '@/components/ui/badge';
import AddToCart from '@/app/(root)/product/[slug]/add-to-cart';
import { Product } from '@/types';

type ProductActionCardProps = {
  product: Product;
};

const ProductActionCard = async ({ product }: ProductActionCardProps) => {
  return (
    <>
      <div className="flex justify-between">
        {product.variants.some((variant) => variant.stock > 0) ? (
          <Badge variant="outline">In Stock</Badge>
        ) : (
          <Badge variant="destructive">Out Of Stock</Badge>
        )}
      </div>

      <div className="pt-5">
        <AddToCart
          product={product}
          outOfStock={product.variants.every((variant) => variant.stock < 1)}
        />
      </div>
    </>
  );
};

export default ProductActionCard;
