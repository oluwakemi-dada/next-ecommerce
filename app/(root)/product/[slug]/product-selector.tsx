'use client';
import { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Variant } from '@/types';

type ProductSelectorProps = {
  variants: Variant[];
  selectedVariant?: Variant;
  onSelectVariant: (variant: Variant) => void;
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

  // Unique available colors (ALL colors, not filtered)
  const allColors = useMemo(() => {
    return hasColors
      ? Array.from(
          new Set(availableVariants.map((v) => v.color).filter(Boolean)),
        )
      : [];
  }, [availableVariants, hasColors]);

  // Unique available sizes (ALL sizes, not filtered)
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

  // Check which sizes are available for the selected color
  const availableSizesForColor = useMemo(() => {
    if (!hasSizes || !hasColors || !selectedColor) return new Set(allSizes);

    return new Set(
      availableVariants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size)
        .filter(Boolean),
    );
  }, [availableVariants, selectedColor, hasColors, hasSizes, allSizes]);

  // Handle color selection with auto-adjustment
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);

    // If the current size is not available for this color, auto-select the first available size
    if (hasSizes && selectedSize) {
      const sizesForColor = availableVariants
        .filter((v) => v.color === color)
        .map((v) => v.size)
        .filter(Boolean);

      if (!sizesForColor.includes(selectedSize)) {
        setSelectedSize(sizesForColor[0]!);
      }
    }
  };

  // Handle size selection with auto-adjustment
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);

    // If the current color is not available for this size, auto-select the first available color
    if (hasColors && selectedColor) {
      const colorsForSize = availableVariants
        .filter((v) => v.size === size)
        .map((v) => v.color)
        .filter(Boolean);

      if (!colorsForSize.includes(selectedColor)) {
        setSelectedColor(colorsForSize[0]!);
      }
    }
  };

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
            {allSizes.map((size) => {
              const isAvailable = availableSizesForColor.has(size);
              const isSelected = size === selectedSize;

              return (
                <Button
                  key={size}
                  variant={isSelected ? 'default' : 'outline'}
                  onClick={() => handleSizeSelect(size!)}
                  className={clsx(!isAvailable && 'opacity-40')}
                >
                  {size}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {hasColors && (
        <div>
          <div className="mb-3 font-medium">Available Color</div>
          <div className="flex gap-3">
            {allColors.map((color) => {
              const isSelected = selectedColor === color;

              return (
                <Button
                  key={color}
                  size="icon"
                  variant={color === selectedColor ? 'default' : 'outline'}
                  onClick={() => handleColorSelect(color!)}
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
