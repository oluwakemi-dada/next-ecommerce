import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductPrice from './product-price';
import { Product } from '@/types';

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

          {product.stock > 0 && (
            <div className="flex-center">
              <Button className="w-full cursor-pointer">Add To Cart</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductActionCard;
