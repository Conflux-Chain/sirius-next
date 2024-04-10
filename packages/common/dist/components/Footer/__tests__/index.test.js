import { jsx as _jsx } from "react/jsx-runtime";
import { render } from '@testing-library/react';
import { Footer } from '..';
describe('<Footer  />', () => {
    it('should match snapshot', () => {
        const left = [_jsx("span", { children: "left" }, "1")];
        const rightTop = [_jsx("span", { children: "rightTop" }, "1")];
        const rightBottom = [
            _jsx("span", { children: "@2020 Conflux. All Rights Reserved" }, "1"),
        ];
        const loadingIndicator = render(_jsx(Footer, { left: left, rightTop: rightTop, rightBottom: rightBottom }));
        expect(loadingIndicator.container.firstChild).toMatchSnapshot();
    });
});
