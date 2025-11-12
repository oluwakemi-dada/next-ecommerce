import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import AddToCart from '@/app/(root)/product/[slug]/add-to-cart';
import { Product } from '@/types';
import ProductPrice from '../../../../components/shared/product/product-price';

type ProductActionCardProps = {
  product: Product;
};

const ProductActionCard = async ({ product }: ProductActionCardProps) => {
  return (
    <div>
      <Card className="py-1">
        <CardContent className="p-4">
          <div className="mb-2 flex justify-between">
            <div>Price</div>
            <div>
              <ProductPrice value={Number(product.price)} />
            </div>
          </div>

          <div className="mb-2 flex justify-between">
            <div>Status</div>
            {product.stock > 0 ? (
              <Badge variant="outline">In Stock</Badge>
            ) : (
              <Badge variant="destructive">Out Of Stock</Badge>
            )}
          </div>

          <div className="flex-center pt-5">
            <AddToCart
              item={{
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0],
                productId: product.id,
                qty: 1,
              }}
              outOfStock={product.stock < 1}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductActionCard;
