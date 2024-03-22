import { ComponentProps } from "react";
export interface BaseButtonProps extends ComponentProps<"div"> {
    disabled?: boolean;
    loading?: boolean;
}
export declare const BaseButton: import("react").ForwardRefExoticComponent<Omit<BaseButtonProps, "ref"> & import("react").RefAttributes<unknown>>;
//# sourceMappingURL=index.d.ts.map