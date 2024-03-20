import { forwardRef } from "react";
import { BaseButton, BaseButtonProps } from "./BaseButton";
import { IconButton } from "./IconButton";
import { ActionButton } from "./ActionButton";

type ButtonType = "default" | "icon" | "action";

interface ButtonProps extends BaseButtonProps {
  type?: ButtonType;
  color?: "default" | "primary";
  size?: "default" | "small";
}

const ComponentMap: Record<
  ButtonType,
  typeof BaseButton | typeof IconButton | typeof ActionButton
> = {
  default: BaseButton,
  icon: IconButton,
  action: ActionButton,
};

const Button = forwardRef<unknown, ButtonProps>(
  ({ type = "default", ...props }, ref) => {
    const Component = ComponentMap[type];
    return (
      <Component
        ref={ref}
        {...props}
      />
    );
  }
);

export default Button;

export { BaseButton } from "./BaseButton";
export { IconButton } from "./IconButton";
export { ActionButton } from "./ActionButton";
