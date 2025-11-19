'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VariantInput } from '@/types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

type ProductSelectorProps = {
  variants: VariantInput[];
  selectedVariant?: VariantInput;
  onSelectVariant: (variant: VariantInput) => void;
};

const ProductSelector = ({
  variants,
  selectedVariant: initialSelectedVariant,
  onSelectVariant,
}: ProductSelectorProps) => {
  // Only consider in-stock variants
  const availableVariants = variants.filter((v) => v.stock > 0);

  // Determine if we have color and size options
  const hasColors = availableVariants.some((v) => v.color);
  const hasSizes = availableVariants.some((v) => v.size);

  // Unique colors and sizes
  const colors = hasColors
    ? Array.from(new Set(availableVariants.map((v) => v.color).filter(Boolean)))
    : [];
  const sizes = hasSizes
    ? Array.from(new Set(availableVariants.map((v) => v.size).filter(Boolean)))
    : [];

  // Local state for currently selected options
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    initialSelectedVariant?.color ?? colors[0] ?? undefined,
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    initialSelectedVariant?.size ?? sizes[0] ?? undefined,
  );

  // Update selected variant whenever color/size changes
  useEffect(() => {
    const variant =
      availableVariants.find(
        (v) =>
          (!hasColors || v.color === selectedColor) &&
          (!hasSizes || v.size === selectedSize),
      ) || null;

    if (variant) onSelectVariant(variant);
  }, [
    selectedColor,
    selectedSize,
    availableVariants,
    hasColors,
    hasSizes,
    onSelectVariant,
  ]);

  return (
    <div className="space-y-7">
      {/* Size Selector */}
      {hasSizes && (
        <div className="">
          <div className="mb-3 font-medium">Available Sizes</div>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={size === selectedSize ? 'default' : 'outline'}
                size='default'
                onClick={() => setSelectedSize(size!)}
                className='cursor-pointer'
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {hasColors && (
        <div>
          <div className="mb-3 font-medium">Available Color</div>
          <div className="flex gap-3">
            {colors.map((color) => (
              <Button
                key={color}
                variant={color === selectedColor ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedColor(color!)}
                style={{ backgroundColor: color! }}
                className={clsx(
                  'h-8 w-8 cursor-pointer rounded-full border',
                  selectedColor === color
                    ? 'ring-accent-foreground border-transparent ring-1 ring-offset-1'
                    : 'border-muted',
                )}
              ></Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
