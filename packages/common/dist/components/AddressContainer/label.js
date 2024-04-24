import {
  Tooltip
} from "../../chunk-UBCDOZDY.js";
import {
  logo_cns_default
} from "../../chunk-DBUTDVFE.js";
import {
  getTranslations
} from "../../chunk-DE2BHFIR.js";

// src/components/AddressContainer/label.tsx
import { Translation } from "react-i18next";
import { Bookmark, Hash } from "@zeit-ui/react-icons";
import { jsx } from "react/jsx-runtime";
var getLabelInfo = (label, type) => {
  const translations = getTranslations();
  if (label) {
    let trans = "";
    let icon = null;
    if (type === "tag") {
      trans = translations.profile.tip.label;
      icon = /* @__PURE__ */ jsx(Bookmark, { color: "var(--theme-color-gray2)", size: 16 });
    } else if (type === "ens") {
      trans = translations.ens.label;
      icon = /* @__PURE__ */ jsx(
        "img",
        {
          src: logo_cns_default,
          className: "w-[16px] h-[16px] mb-[3px] mr-[2px] flex-shrink-0 align-bottom",
          alt: ""
        }
      );
    } else if (type === "nametag") {
      trans = translations.nametag.label;
      icon = /* @__PURE__ */ jsx(Hash, { color: "var(--theme-color-gray2)", size: 16 });
    }
    return {
      label,
      icon: /* @__PURE__ */ jsx("div", { className: "mr-[2px]", children: /* @__PURE__ */ jsx(Tooltip, { title: /* @__PURE__ */ jsx(Translation, { children: (t) => t(trans) }), children: icon }) })
    };
  }
  return {
    label: "",
    icon: null
  };
};
export {
  getLabelInfo
};
//# sourceMappingURL=label.js.map