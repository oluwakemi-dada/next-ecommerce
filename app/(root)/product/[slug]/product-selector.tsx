'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { VariantInput } from '@/types';
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
    <div className="space-y-4">
      {/* Color Selector */}
      {hasColors && (
        <div>
          <div className="mb-1 font-medium">Color</div>
          <div className="flex gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                variant={color === selectedColor ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedColor(color!)}
              >
                {color}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {hasSizes && (
        <div>
          <div className="mb-1 font-medium">Size</div>
          <div className="flex gap-2">
            {sizes.map((size) => (
              <Button
                key={size}
                variant={size === selectedSize ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedSize(size!)}
              >
                {size}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Stock / Availability */}
      <div>
        {availableVariants.find(
          (v) =>
            (!hasColors || v.color === selectedColor) &&
            (!hasSizes || v.size === selectedSize),
        ) ? (
          <Badge
            variant={
              availableVariants.find(
                (v) =>
                  (!hasColors || v.color === selectedColor) &&
                  (!hasSizes || v.size === selectedSize),
              )!.stock > 0
                ? 'outline'
                : 'destructive'
            }
          >
            {availableVariants.find(
              (v) =>
                (!hasColors || v.color === selectedColor) &&
                (!hasSizes || v.size === selectedSize),
            )!.stock > 0
              ? 'In Stock'
              : 'Out of Stock'}
          </Badge>
        ) : (
          <Badge variant="destructive">Unavailable</Badge>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;
