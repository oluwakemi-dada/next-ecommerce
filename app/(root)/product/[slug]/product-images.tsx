'use client';
import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type ProductImagesProps = { images: string[] };

const ProductImages = ({ images }: ProductImagesProps) => {
  const [current, setCurrent] = useState(0);

  return (
    <div className="col-span-2">
      <Image
        src={images[current]}
        alt="product image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center"
      />
      <div className="flex gap-2">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setCurrent(index)}
            className={cn(
              'cursor-pointer border hover:border-orange-600',
              current === index && 'border-orange-500',
            )}
            aria-pressed={current === index}
          >
            <Image src={image} alt="image" width={100} height={100} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
