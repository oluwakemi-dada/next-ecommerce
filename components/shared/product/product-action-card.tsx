import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import ProductPrice from './product-price';

type ProductActionCardProps = {
  product: Product;
};

const ProductActionCard = ({ product }: ProductActionCardProps) => {
  return (
    <div>
      <Card>
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
            <Button
              disabled={product.stock < 1}
              className="w-full cursor-pointer"
            >
              Add To Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductActionCard;
