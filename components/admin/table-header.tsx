import ActiveFilter from './active-filter';

type TableHeaderProps = {
  title: string;
  searchText: string;
};

const TableHeader = ({ title, searchText }: TableHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <h1 className="h2-bold">{title}</h1>
      <ActiveFilter searchText={searchText} />
    </div>
  );
};

export default TableHeader;
