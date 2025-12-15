import { requireAdmin } from '@/lib/auth-guard';
import ProductsHeader from './products-header';
import ProductsTable from './products-table';
import { getAllProducts } from '@/lib/actions/product.actions';
import Pagination from '@/components/shared/pagination';
import InvalidPage from '@/components/admin/invalid-page';

type AdminProductsPageProps = {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
};

const AdminProductsPage = async (props: AdminProductsPageProps) => {
  await requireAdmin();

  const searchParams = await props.searchParams;

  const pageNumber = Number(searchParams.page) || 1;
  const searchText = searchParams.query || '';
  const category = searchParams.category || '';

  const products = await getAllProducts({
    query: searchText,
    page: pageNumber,
    category,
  });

  const isInvalidPage =
    products.totalPages > 0 && pageNumber > products.totalPages;

  return (
    <div className="space-y-3">
      <ProductsHeader searchText={searchText} />
      <div className="overflow-x-auto">
        {isInvalidPage ? (
          <InvalidPage pageNumber={pageNumber} />
        ) : (
          <ProductsTable products={products.data} />
        )}

        {products.totalPages > 1 && (
          <Pagination
            currentPage={pageNumber}
            totalPages={products.totalPages}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProductsPage;
