import { Control, FieldArrayWithId } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldGroup } from '@/components/ui/field';
import { VariantFormFields } from './variant-form-fields';

/* eslint-disable @typescript-eslint/no-explicit-any */
type VariantsSectionProps = {
  fields: FieldArrayWithId<any, 'variants', 'id'>[];
  control: Control<any>;
  hasVariants: boolean;
  selectedCategory: string;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
};

const VariantSection = ({
  fields,
  control,
  hasVariants,
  selectedCategory,
  onAddVariant,
  onRemoveVariant,
}: VariantsSectionProps) => {
  return (
    <FieldGroup>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Product Variants</h3>
            <p className="text-muted-foreground text-sm">
              {hasVariants
                ? 'Stock is managed at the variant level'
                : 'Add variants for different colors, sizes, etc.'}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddVariant}
            className="cursor-pointer"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Variant
          </Button>
        </div>

        {fields.map((field, index) => (
          <VariantFormFields
            key={field.id}
            index={index}
            control={control}
            selectedCategory={selectedCategory}
            onRemove={() => onRemoveVariant(index)}
          />
        ))}
      </div>
    </FieldGroup>
  );
};

export default VariantSection;
