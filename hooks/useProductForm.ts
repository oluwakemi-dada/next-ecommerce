import { useEffect } from 'react';
import z from 'zod';
import { toast } from 'sonner';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/lib/actions/product.actions';
import { insertProductSchema, updateProductSchema } from '@/lib/validators';
import { productDefaultValues, variantDefaultValues } from '@/lib/constants';
import { getSizesForCategory } from '@/lib/utils';

type UseProductFormProps = {
  type: 'Create' | 'Update';
  product?: z.infer<typeof updateProductSchema>;
  productId?: string;
};

export const useProductForm = ({
  type,
  product,
  productId,
}: UseProductFormProps) => {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(
      type === 'Update' ? updateProductSchema : insertProductSchema,
    ),

    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  });

  const selectedCategory = form.watch('category');
  const variants = form.watch('variants');
  const hasVariants = variants && variants.length > 0 ? true : false;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  // Clear invalid sizes when category changes
  useEffect(() => {
    if (variants && variants.length > 0) {
      const availableSizes = getSizesForCategory(selectedCategory);

      variants.forEach((variant, index) => {
        if (variant.size && !availableSizes.includes(variant.size)) {
          // Clear size if it's not valid for the new category
          form.setValue(`variants.${index}.size`, null);
        }
      });
    }
  }, [selectedCategory, form, variants]);

  const handleAddVariant = () => {
    // Clear product-level stock when adding first variant
    if (fields.length === 0) {
      form.setValue('stock', null, { shouldValidate: true });
    }

    append(variantDefaultValues);
  };

  const handleRemoveVariant = (index: number) => {
    remove(index);
  };

  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values,
  ) => {
    // On Create
    if (type === 'Create') {
      const res = await createProduct(values);

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
    }

    // On Update
    if (type === 'Update') {
      if (!productId) {
        router.push('/admin/products');
        return;
      }

      const res = await updateProduct({
        ...values,
        id: productId,
      });

      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push('/admin/products');
      }
    }
  };

  return {
    form,
    selectedCategory,
    hasVariants,
    fields,
    handleAddVariant,
    handleRemoveVariant,
    onSubmit,
  };
};
