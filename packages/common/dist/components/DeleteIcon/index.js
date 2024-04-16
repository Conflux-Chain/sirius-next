// src/components/DeleteIcon/index.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var DeleteIcon = (props) => {
  const { color = "#0054FE" } = props;
  return /* @__PURE__ */ jsx(
    "svg",
    {
      width: "16px",
      height: "16px",
      viewBox: "0 0 16 16",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      children: /* @__PURE__ */ jsx(
        "g",
        {
          id: "Web",
          stroke: "none",
          strokeWidth: "1",
          fill: "none",
          fillRule: "evenodd",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: /* @__PURE__ */ jsx(
            "g",
            {
              transform: "translate(-396.000000, -249.000000)",
              stroke: color,
              strokeWidth: "1.5",
              children: /* @__PURE__ */ jsxs("g", { id: "Clear", transform: "translate(396.000000, 249.000000)", children: [
                /* @__PURE__ */ jsx("circle", { cx: "8", cy: "8", r: "7" }),
                /* @__PURE__ */ jsx("line", { x1: "10.1", y1: "5.9", x2: "5.9", y2: "10.1" }),
                /* @__PURE__ */ jsx("line", { x1: "5.9", y1: "5.9", x2: "10.1", y2: "10.1" })
              ] })
            }
          )
        }
      )
    }
  );
};
export {
  DeleteIcon
};
//# sourceMappingURL=index.js.map