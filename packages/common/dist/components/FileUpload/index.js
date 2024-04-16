// src/components/FileUpload/index.tsx
import React from "react";
import { jsx } from "react/jsx-runtime";
var FileUpload = React.forwardRef(
  ({
    onChange = () => {
    },
    onError = () => {
    },
    accept = "",
    ...others
  }, ref) => {
    const handleInputChange = (e) => {
      let reader = new FileReader();
      let file = e.target.files?.[0];
      if (file) {
        reader.onloadend = () => {
          try {
            onChange(reader.result);
          } catch (e2) {
            onError(e2);
          }
        };
        reader.readAsText(file);
      } else {
        const error = new Error("no file");
        onError(error);
      }
    };
    return /* @__PURE__ */ jsx(
      "input",
      {
        type: "file",
        name: "File",
        style: { display: "none" },
        accept,
        ref,
        onChange: handleInputChange,
        ...others
      }
    );
  }
);
export {
  FileUpload
};
//# sourceMappingURL=index.js.map