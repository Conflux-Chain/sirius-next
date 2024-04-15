import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import { useI18n } from '../../store';
import { Link } from '../Link';
const Title = ({ header }) => {
    const { t } = useTranslation();
    const { translations } = useI18n();
    return (_jsxs("div", { className: "flex items-start justify-between pt-4 pr-5 pb-0 pl-5", children: [_jsxs("div", { children: [_jsx("div", { className: "text-[16px] text-[#26244B] ", children: header.title.text }), _jsx("div", { className: "text-[14px] text-[#74798C]", children: header.subtitle.text })] }), _jsx(Link, { className: "shrink-0", href: header?.breadcrumb?.[1]?.path || '/', children: t(translations.highcharts.preview.viewDetail) })] }));
};
export default Title;
