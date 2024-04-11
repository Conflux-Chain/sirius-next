import { Link } from '../Link';
interface BreadcrumbItemType {
  name: string;
  path: string;
}
const BreadcrumbNav = ({
  breadcrumb,
}: {
  breadcrumb: BreadcrumbItemType[];
}) => {
  return (
    <div className="absolute right-0 flex z-10">
      {breadcrumb.map(
        (e: BreadcrumbItemType, i: number, arr: BreadcrumbItemType[]) => (
          <div key={i}>
            <Link href={e.path}>{e.name}</Link>
            {i < arr.length - 1 && <span className="mx-2">/</span>}
          </div>
        ),
      )}
    </div>
  );
};

export default BreadcrumbNav;
