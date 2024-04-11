import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Title = ({ header }) => {
    return (_jsx("div", { className: 'relative', children: _jsxs("div", { className: "text-[1.7143rem] text-[#1a1a1a] font-medium leading-[2.2857rem] mb-[1.1429rem] mt-[2.2857rem]", children: [header.title.text, _jsx("div", { className: "text-[1rem] text-[#74798c] leading-[1.2857rem] mt-[0.8571rem]", children: header.subtitle.text })] }) }));
};
export default Title;
