import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Cart, OrderItem } from '@/types';

type OrderItemsTableProps = {
  items: Cart['items'] | OrderItem[];
};

const OrderItemsTable = ({ items }: OrderItemsTableProps) => {
  return (
    <Card className="py-0">
      <CardContent className="gap-4 p-4">
        <h2 className="pb-4 text-xl">Order Items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.variantId || item.productId}>
                <TableCell>
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex items-center"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    <span className="px-2">
                      {item.name} {item.color && ` | ${item.color}`}
                      {item.size && ` | ${item.size}`}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="px-2">{item.qty}</span>
                </TableCell>
                <TableCell className="text-right">${item.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default OrderItemsTable;
