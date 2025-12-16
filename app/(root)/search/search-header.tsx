type SearchHeaderProps = {
  q: string;
  category: string;
  price: string;
  rating: string;
  sort: string;
  // getFilterUrl: (params: { s?: string }) => string;
};

const SearchHeader = ({
  q,
  category,
  price,
  rating,
  sort,
  // getFilterUrl,
}: SearchHeaderProps) => {
  return (
    <div className="flex-between my-4 flex-col md:flex-row">
      <div className="flex items-center">Filter</div>
    </div>
  );
};

export default SearchHeader;
