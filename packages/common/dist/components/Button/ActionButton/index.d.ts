/// <reference types="react" />
import { BaseButtonProps } from "../BaseButton";
interface ButtonProps extends BaseButtonProps {
    color?: "default" | "primary";
    size?: "default" | "small";
}
export declare const ActionButton: import("react").ForwardRefExoticComponent<Omit<ButtonProps, "ref"> & import("react").RefAttributes<unknown>>;
export {};
//# sourceMappingURL=index.d.ts.map