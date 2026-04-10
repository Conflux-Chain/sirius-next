interface Props {
  data: string;
}

export const Original = ({ data }: Props) => {
  return (
    <div className="m-initial h-13.2857rem overflow-y-auto text-#97a3b4 bg-#fafbfc px-0.7143rem font-[var(--theme-monospace-font)]">
      <p>{data}</p>
    </div>
  );
};
