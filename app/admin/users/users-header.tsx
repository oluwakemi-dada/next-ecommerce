import ActiveFilter from '@/components/admin/active-filter';

type UsersHeader = {
  searchText: string;
};

const UsersHeader = ({ searchText }: UsersHeader) => {
  return (
    <div className="flex items-center gap-3">
      <h1 className="h2-bold">Users</h1>
      <ActiveFilter searchText={searchText} />
    </div>
  );
};

export default UsersHeader;
