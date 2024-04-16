import {
  Link
} from "./chunk-EXW5F6NL.js";

// src/components/Charts/BreadcrumbNav.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var BreadcrumbNav = ({
  breadcrumb
}) => {
  return /* @__PURE__ */ jsx("div", { className: "absolute right-0 flex z-10", children: breadcrumb.map(
    (e, i, arr) => /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Link, { href: e.path, children: e.name }),
      i < arr.length - 1 && /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" })
    ] }, i)
  ) });
};
var BreadcrumbNav_default = BreadcrumbNav;

export {
  BreadcrumbNav_default
};
//# sourceMappingURL=chunk-WLKMIQSZ.js.map