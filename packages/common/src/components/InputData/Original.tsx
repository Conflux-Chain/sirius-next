import { cn } from 'src/utils';

interface Props {
  data: string;
  className?: string;
}

export const Original = ({ data, className }: Props) => {
  return (
    <div
      className={cn(
        'm-initial max-h-13.2857rem overflow-y-auto text-#97a3b4 bg-#fafbfc px-0.7143rem font-[var(--theme-monospace-font)]',
        className,
      )}
    >
      <p>{data}</p>
    </div>
  );
};
