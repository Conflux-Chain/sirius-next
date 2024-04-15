import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from '../Link';
const BreadcrumbNav = ({ breadcrumb, }) => {
    return (_jsx("div", { className: "absolute right-0 flex z-10", children: breadcrumb.map((e, i, arr) => (_jsxs("div", { children: [_jsx(Link, { href: e.path, children: e.name }), i < arr.length - 1 && _jsx("span", { className: "mx-2", children: "/" })] }, i))) }));
};
export default BreadcrumbNav;
