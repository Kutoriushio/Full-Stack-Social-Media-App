type StatBlockProps = {
  value: string | number;
  label: string;
};

const StatBlock = ({ value, label }: StatBlockProps) => {
  return (
    <div className="flex flex-row xl:flex-col gap-2 xl:gap-0">
      <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
      <p className="small-medium lg:base-medium text-light-2">{label}</p>
    </div>
  );
};

export default StatBlock;
