import Link from 'next/link';
import DeleteDialog from '@/components/shared/delete-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatId } from '@/lib/utils';
import { Users } from '@/types';

type UsersTable = {
  users: Users;
};

const UsersTable = ({ users }: UsersTable) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>NAME</TableHead>
          <TableHead>EMAIL</TableHead>
          <TableHead>ROLE</TableHead>
          <TableHead>ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.data.map((user) => (
          <TableRow key={user.id} className="h-14">
            <TableCell>{formatId(user.id)}</TableCell>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              {user.role === 'user' ? (
                <Badge variant="secondary">User</Badge>
              ) : (
                <Badge variant="default">Admin</Badge>
              )}
            </TableCell>
            <TableCell>
              <Button asChild variant="outline" size="sm">
                <Link href={`/admin/users/${user.id}`}>Edit</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default UsersTable;
