import { SVGAttributes } from 'react';

export const PositiveArrow: React.FC<SVGAttributes<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M8.22808 5.08857L13.9043 10.4702C13.9972 10.5584 14.0254 10.6916 13.9759 10.8076C13.9263 10.9235 13.8087 10.9995 13.6778 11H2.32218C2.19133 10.9995 2.0737 10.9235 2.02412 10.8076C1.97455 10.6916 2.00281 10.5584 2.09571 10.4702L7.77353 5.08857C7.89933 4.97048 8.10067 4.97048 8.22647 5.08857H8.22808Z"
      fill="#4AC2AB"
    />
  </svg>
);
export const NegativeArrow: React.FC<SVGAttributes<SVGSVGElement>> = props => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      d="M8.22808 10.9114L13.9043 5.5298C13.9972 5.44156 14.0254 5.30841 13.9759 5.19245C13.9263 5.07648 13.8087 5.00053 13.6778 5H2.32218C2.19133 5.00053 2.0737 5.07648 2.02412 5.19245C1.97455 5.30841 2.00281 5.44156 2.09571 5.5298L7.77353 10.9114C7.89933 11.0295 8.10067 11.0295 8.22647 10.9114H8.22808Z"
      fill="#FA5D5D"
    />
  </svg>
);
