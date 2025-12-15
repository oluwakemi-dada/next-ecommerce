type InvalidPageProps = {
  pageNumber: number;
};

const InvalidPage = ({ pageNumber }: InvalidPageProps) => {
  return (
    <div className="py-8 text-center">
      Page <strong>{pageNumber}</strong> not found.
      <br />
      Please select a valid page from the pagination below.
    </div>
  );
};

export default InvalidPage;
