'use client';
import z from 'zod';
import { updateProductSchema } from '@/lib/validators';
import { useProductForm } from '@/hooks/useProductForm';
import VariantSection from './variant-section';
import SubmitButton from './submit-button';
import BasicInfoFields from './basic-info-fields';
import PricingFields from './pricing-fields';
import DescriptionField from './description-field';
import ImagesField from './images-field';
import FeaturedFields from './featured-fields';

type ProductFormProps = {
  type: 'Create' | 'Update';
  product?: z.infer<typeof updateProductSchema>;
  productId?: string;
};

const ProductForm = ({ type, product, productId }: ProductFormProps) => {
  const {
    form,
    selectedCategory,
    hasVariants,
    fields,
    handleAddVariant,
    handleRemoveVariant,
    onSubmit,
  } = useProductForm({ type, product, productId });

  return (
    <form
      method="post"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8"
    >
      <BasicInfoFields control={form.control} form={form} />

      <PricingFields control={form.control} hasVariants={hasVariants} />

      <ImagesField form={form} control={form.control} />

      <FeaturedFields control={form.control} form={form} />

      <DescriptionField control={form.control} />

      <VariantSection
        fields={fields}
        control={form.control}
        form={form}
        hasVariants={hasVariants}
        selectedCategory={selectedCategory}
        onAddVariant={handleAddVariant}
        onRemoveVariant={handleRemoveVariant}
      />

      <SubmitButton isSubmitting={form.formState.isSubmitting} type={type} />
    </form>
  );
};

export default ProductForm;
