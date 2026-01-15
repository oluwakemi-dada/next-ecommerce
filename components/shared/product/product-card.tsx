import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Product } from '@/types';
import ProductPrice from './product-price';
import Rating from './rating';

type ProductCardProps = {
  product: Product;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const inStock =
    product.variants.length > 0
      ? product.variants.some((variant) => variant.stock > 0)
      : !!product.stock && product.stock > 0;

  return (
    <Card className="w-full p-3 sm:max-w-sm">
      <CardHeader className="items-center p-0">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={true}
            className="w-full rounded-sm"
          />
        </Link>
      </CardHeader>
      <CardContent className="grid gap-4 px-2 pt-0 pb-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <Rating value={Number(product.rating)} />
          {inStock ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className="text-destructive">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
