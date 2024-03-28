import React, { PropsWithChildren, MouseEvent } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';

interface LinkProps {
  className?: string;
  href: string;
  ga?: { category: string; action: string; label: string };
  state?: any; // Consider typing this more strictly if possible
}

export const Link: React.FC<PropsWithChildren<LinkProps>> = React.memo(
  ({ className, href, ga, children, state, ...others }) => {
    const history = useHistory();

    const handleClick = (e: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
      e.preventDefault();
      
      if (!href) return;
      
      if (/^http/.test(href)) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else if (e.metaKey || e.ctrlKey) {
        window.open(`${window.location.origin}${href}`, '_blank');
      } else {
        history.push({
          pathname: href,
          state: state,
        });
      }
    };

    if (/^http/.test(href)) {
      return (
        <a className={className} href={href} onClick={handleClick} {...others}>
          {children}
        </a>
      );
    } else {
      return (
        <RouterLink className={className} to={{
          pathname: href,
          state: state
        }} onClick={handleClick} {...others}>
          {children}
        </RouterLink>
      );
    }
  }
);

// react-router-dom v6
// import React, { PropsWithChildren, MouseEvent } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';

// interface LinkProps {
//   className: string;
//   href: string;
//   ga?: { category: string; action: string; label: string };
//   state?: any;
// }

// export const Link: React.FC<PropsWithChildren<LinkProps>> = React.memo(
//   ({ className, href, ga, children, state, ...others }) => {
//     const navigate = useNavigate();

//     const handleClick = (e: MouseEvent<HTMLAnchorElement | HTMLDivElement>) => {
//       e.preventDefault();
      
//       if (!href) return;
      
//       if (/^http/.test(href)) {
//         window.open(href, '_blank', 'noopener,noreferrer');
//       } else if (e.metaKey || e.ctrlKey) {
//         window.open(`${window.location.origin}${href}`, '_blank');
//       } else {
//         navigate(href, { state });
//       }
//     };

//     if (/^http/.test(href)) {
//       return (
//         <a href={href} onClick={handleClick} {...others}>
//           {children}
//         </a>
//       );
//     } else {
//       return (
//         <RouterLink className={className} to={href} state={state} onClick={handleClick} {...others}>
//           {children}
//         </RouterLink>
//       );
//     }
//   }
// );