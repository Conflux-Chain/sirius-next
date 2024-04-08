import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
export const Link = React.memo(({ className, href, children, state, ...others }) => {
    const history = useHistory();
    const handleClick = (e) => {
        e.preventDefault();
        if (!href)
            return;
        if (/^http/.test(href)) {
            window.open(href, '_blank', 'noopener,noreferrer');
        }
        else if (e.metaKey || e.ctrlKey) {
            window.open(`${window.location.origin}${href}`, '_blank');
        }
        else {
            history.push({
                pathname: href,
                state: state,
            });
        }
    };
    if (/^http/.test(href)) {
        return (_jsx("a", { className: className, href: href, onClick: handleClick, ...others, children: children }));
    }
    else {
        return (_jsx(RouterLink, { className: className, to: {
                pathname: href,
                state: state
            }, onClick: handleClick, ...others, children: children }));
    }
});
