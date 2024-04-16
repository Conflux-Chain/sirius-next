import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import docCookies from '../../utils/cookie';
import { useI18n } from '../../store';
import { LOCALSTORAGE_KEYS_MAP } from '../../utils/constants';
import { CookieIcon } from './CookieIcon';
export const CookieTip = React.memo(() => {
    const { translations } = useI18n();
    const { t } = useTranslation();
    const [cookieAgreed, setCookieAgreed] = useState(!!docCookies.getItem(LOCALSTORAGE_KEYS_MAP.cookieAgreed) ||
        !!localStorage.getItem(LOCALSTORAGE_KEYS_MAP.cookieAgreed));
    const agreeCookie = () => {
        docCookies.setItem(LOCALSTORAGE_KEYS_MAP.cookieAgreed, 'true', Infinity);
        // for safari https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#why-is-my-expiration-time-capped-at-7-days-or-24-hours
        localStorage.setItem(LOCALSTORAGE_KEYS_MAP.cookieAgreed, 'true');
        setCookieAgreed(true);
    };
    return cookieAgreed ? null : (_jsxs("div", { className: "fixed left-0 right-0 bottom-0 p-21px lh-30px text-center text-14px text-#fff bg-#282e44", children: [_jsx(CookieIcon, { className: "w-20px h-20px mr-10px" }), _jsx("span", { dangerouslySetInnerHTML: {
                    __html: t(translations.footer.cookie),
                }, className: "[&>a]:text-#ddd [&>a]:border-b [&>a]:border-#ddd [&>a]:hover:border-#fff [&>a]:hover:text-#fff" }), _jsx("span", { className: "inline-block ml-10px w-87px h-30px bg-#f9fafb text-#000 cursor-pointer rounded-2px font-medium text-center uppercase", onClick: agreeCookie, children: t(translations.footer.cookieAgree) })] }));
});
