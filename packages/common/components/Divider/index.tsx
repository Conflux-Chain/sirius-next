import clsx from "clsx";

export const Divider: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={clsx(
        "w-auto max-w-full h-[calc(1*1px)] my-[calc(1*16px+1px*0)] relative bg-#eee",
        className
      )}
    ></div>
  );
};
