import { ComponentProps } from "react";
interface ButtonProps extends ComponentProps<"div"> {
    disabled?: boolean;
    loading?: boolean;
    onClick?: VoidFunction;
}
export declare const ActionButton: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & import("react").RefAttributes<unknown>>;
export {};
//# sourceMappingURL=index.d.ts.map