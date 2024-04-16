import "../../chunk-ADTPJ4V5.js";

// src/utils/hooks/useAge.ts
import { useEffect, useState } from "react";
var useAge = (format) => {
  const [ageFormat, toggleAgeFormat] = useState(
    format || localStorage.getItem("CONFLUX_SCAN_TABLE_AGE_FORMAT" /* ageFormat */) !== "datetime" ? "age" : "datetime"
  );
  useEffect(() => {
    if (localStorage.getItem("CONFLUX_SCAN_TABLE_AGE_FORMAT" /* ageFormat */) !== ageFormat) {
      localStorage.setItem("CONFLUX_SCAN_TABLE_AGE_FORMAT" /* ageFormat */, ageFormat);
    }
  }, [format, ageFormat]);
  return [ageFormat, toggleAgeFormat];
};
export {
  useAge
};
//# sourceMappingURL=useAge.js.map