// src/components/Link/index.tsx
import React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { jsx } from "react/jsx-runtime";
var Link = React.memo(
  ({ className, href, children, state, ...others }) => {
    const history = useHistory();
    const handleClick = (e) => {
      e.preventDefault();
      if (!href)
        return;
      if (/^http/.test(href)) {
        window.open(href, "_blank", "noopener,noreferrer");
      } else if (e.metaKey || e.ctrlKey) {
        window.open(`${window.location.origin}${href}`, "_blank");
      } else {
        history.push({
          pathname: href,
          state
        });
      }
    };
    if (/^http/.test(href)) {
      return /* @__PURE__ */ jsx("a", { className, href, onClick: handleClick, ...others, children });
    } else {
      return /* @__PURE__ */ jsx(
        RouterLink,
        {
          className,
          to: {
            pathname: href,
            state
          },
          onClick: handleClick,
          ...others,
          children
        }
      );
    }
  }
);

export {
  Link
};
//# sourceMappingURL=chunk-EXW5F6NL.js.map