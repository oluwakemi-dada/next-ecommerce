import Link from 'next/link';
import DeleteDialog from '@/components/shared/delete-dialog';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, formatId } from '@/lib/utils';
import { Product } from '@/types';

type ProductsTableProps = {
  products: Product[];
};

const ProductsTable = ({ products }: ProductsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead className="text-right">PRICE</TableHead>
          <TableHead>CATEGORY</TableHead>
          <TableHead>STOCK</TableHead>
          <TableHead>RATING</TableHead>
          <TableHead className="w-[100px]">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="h-14">
            <TableCell>{formatId(product.id)}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(product.price)}
            </TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>{product.rating}</TableCell>
            <TableCell className="flex gap-1">
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/products/${product.id}`}>Edit</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProductsTable;
