import {
  CookieIcon
} from "../../chunk-HI4CUQ7A.js";
import {
  cookie_default
} from "../../chunk-QCOK2N67.js";
import "../../chunk-KRQR6UDQ.js";
import {
  useI18n
} from "../../chunk-FTXC5EVM.js";

// src/components/CookieTip/index.tsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { jsx, jsxs } from "react/jsx-runtime";
var CookieTip = React.memo(() => {
  const { translations } = useI18n();
  const { t } = useTranslation();
  const [cookieAgreed, setCookieAgreed] = useState(
    !!cookie_default.getItem("CONFLUXSCAN_COOKIE_AGREED" /* cookieAgreed */) || !!localStorage.getItem("CONFLUXSCAN_COOKIE_AGREED" /* cookieAgreed */)
  );
  const agreeCookie = () => {
    cookie_default.setItem("CONFLUXSCAN_COOKIE_AGREED" /* cookieAgreed */, "true", Infinity);
    localStorage.setItem("CONFLUXSCAN_COOKIE_AGREED" /* cookieAgreed */, "true");
    setCookieAgreed(true);
  };
  return cookieAgreed ? null : /* @__PURE__ */ jsxs("div", { className: "fixed left-0 right-0 bottom-0 p-21px lh-30px text-center text-14px text-#fff bg-#282e44", children: [
    /* @__PURE__ */ jsx(CookieIcon, { className: "w-20px h-20px mr-10px" }),
    /* @__PURE__ */ jsx(
      "span",
      {
        dangerouslySetInnerHTML: {
          __html: t(translations.footer.cookie)
        },
        className: "[&>a]:text-#ddd [&>a]:border-b [&>a]:border-#ddd [&>a]:hover:border-#fff [&>a]:hover:text-#fff"
      }
    ),
    /* @__PURE__ */ jsx(
      "span",
      {
        className: "inline-block ml-10px w-87px h-30px bg-#f9fafb text-#000 cursor-pointer rounded-2px font-medium text-center uppercase",
        onClick: agreeCookie,
        children: t(translations.footer.cookieAgree)
      }
    )
  ] });
});
export {
  CookieTip
};
//# sourceMappingURL=index.js.map