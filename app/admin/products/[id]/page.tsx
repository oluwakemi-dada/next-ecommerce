import ProductForm from '@/components/admin/product-form/product-form';
import { getProductById } from '@/lib/actions/product.actions';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-guard';

type AdminProductUpdatePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: 'Update Product',
};

const AdminProductUpdatePage = async ({
  params,
}: AdminProductUpdatePageProps) => {
  await requireAdmin();

  const { id } = await params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <h1 className="h2-bold">Update Product</h1>

      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
};

export default AdminProductUpdatePage;
