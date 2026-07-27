/**
 *
 * FuncResponse Component
 *
 */

interface Props {
  name: string;
}

export const FuncResponse = ({ name }: Props) => {
  return (
    <div className="my-12px text-14px lh-18px font-500 text-#97a3b4">
      [ <strong>{name}</strong> method response ]
    </div>
  );
};
