type FilterPillProps = {
  label: string;
  value: string;
};

const FilterPill = ({ label, value }: FilterPillProps) => {
  return (
    <div className="bg-muted flex items-center gap-1 rounded-md px-2 py-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default FilterPill;
