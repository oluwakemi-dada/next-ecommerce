'use client';
import { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { VariantInput } from '@/types';

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

  // Detect if product has color/size
  const hasColors = availableVariants.some((v) => v.color);
  const hasSizes = availableVariants.some((v) => v.size);

  // Unique available colors
  const allColors = useMemo(() => {
    return hasColors
      ? Array.from(
          new Set(availableVariants.map((v) => v.color).filter(Boolean)),
        )
      : [];
  }, [availableVariants, hasColors]);

  // Unique available sizes
  const allSizes = useMemo(() => {
    return hasSizes
      ? Array.from(
          new Set(availableVariants.map((v) => v.size).filter(Boolean)),
        )
      : [];
  }, [availableVariants, hasSizes]);

  // Selected state
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    initialSelectedVariant?.color ?? allColors[0] ?? undefined,
  );
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    initialSelectedVariant?.size ?? allSizes[0] ?? undefined,
  );

  // Sizes valid for selected color
  const filteredSizes = useMemo(() => {
    if (!hasSizes) return [];

    if (!hasColors || !selectedColor) return allSizes;

    return Array.from(
      new Set(
        availableVariants
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size)
          .filter(Boolean),
      ),
    );
  }, [availableVariants, selectedColor, hasColors, hasSizes, allSizes]);

  // Colors valid for selected size
  const filteredColors = useMemo(() => {
    if (!hasColors) return [];

    if (!hasSizes || !selectedSize) return allColors;

    return Array.from(
      new Set(
        availableVariants
          .filter((v) => v.size === selectedSize)
          .map((v) => v.color)
          .filter(Boolean),
      ),
    );
  }, [availableVariants, selectedSize, hasColors, hasSizes, allColors]);

  // Auto-select valid combination
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
        <div>
          <div className="mb-3 font-medium">Available Sizes</div>
          <div className="flex gap-3">
            {filteredSizes.map((size) => (
              <Button
                key={size}
                variant={size === selectedSize ? 'default' : 'outline'}
                onClick={() => setSelectedSize(size!)}
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
            {filteredColors.map((color) => {
              const isSelected = selectedColor === color;

              return (
                <Button
                  key={color}
                  size="icon"
                  variant={color === selectedColor ? 'default' : 'outline'}
                  onClick={() => setSelectedColor(color!)}
                  style={{ backgroundColor: color! }}
                  className={clsx(
                    'h-8 w-8 cursor-pointer rounded-full border transition',
                    isSelected
                      ? 'ring-accent-foreground border-transparent ring-1 ring-offset-1'
                      : 'border-gray-300',
                  )}
                ></Button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSelector;
