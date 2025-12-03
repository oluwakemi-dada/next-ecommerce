import { Input } from '../ui/input';

const AdminSearch = () => {
  return (
    <form>
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
