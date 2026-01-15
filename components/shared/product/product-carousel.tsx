'use client';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/types';

type ProductCarouselProps = {
  data: Product[];
};

const ProductCarousel = ({ data }: ProductCarouselProps) => {
  return (
    <Carousel
      className="mb-12 w-full"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent>
        {data.map((product: Product, index) => (
          <CarouselItem key={product.id}>
            <Link href={`/product/${product.slug}`}>
              <div className="relative mx-auto">
                <Image
                  src={product.banner!}
                  alt={`${product.name} banner`}
                  width={900}
                  height={263}
                  sizes="100vw"
                  className="h-auto w-full"
                  priority={index === 0}
                />
                <div className="absolute inset-0 flex items-end justify-center">
                  <h2 className="bg-opacity-50 bg-gray-900 px-2 text-2xl font-bold text-white">
                    {product.name}
                  </h2>
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-9 h-7 w-7 cursor-pointer" />
      <CarouselNext className="-right-9 h-7 w-7 cursor-pointer" />
    </Carousel>
  );
};

export default ProductCarousel;
