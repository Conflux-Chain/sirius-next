import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
export const FileUpload = React.forwardRef(({ onChange = () => { }, onError = () => { }, accept = '', ...others }, ref) => {
    const handleInputChange = (e) => {
        let reader = new FileReader();
        let file = e.target.files?.[0];
        if (file) {
            reader.onloadend = () => {
                try {
                    onChange(reader.result);
                }
                catch (e) {
                    onError(e);
                }
            };
            reader.readAsText(file);
        }
        else {
            const error = new Error('no file');
            onError(error);
        }
    };
    return (_jsx("input", { type: "file", name: "File", style: { display: 'none' }, accept: accept, ref: ref, onChange: handleInputChange, ...others }));
});
