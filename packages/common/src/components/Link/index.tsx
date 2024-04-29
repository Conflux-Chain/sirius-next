import React, { PropsWithChildren, MouseEvent } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { TrackEventParams, trackEvent } from '../../utils/ga';
import clsx from 'clsx';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  state?: any; // Consider typing this more strictly if possible
  ga?: TrackEventParams;
  afterClick?: VoidFunction;
}

export const Link: React.FC<PropsWithChildren<LinkProps>> = React.memo(
  ({ className, href, children, state, ga = null, afterClick, ...others }) => {
    const history = useHistory();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (ga) {
        trackEvent(ga);
      }

      if (!href) return;

      if (/^http/.test(href)) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else if (e.metaKey || e.ctrlKey) {
        window.open(`${window.location.origin}${href}`, '_blank');
      } else {
        history.push(href, state);
      }
      afterClick?.();
    };

    if (href && /^http/.test(href)) {
      return (
        <a
          className={clsx('link', className)}
          href={href}
          onClick={handleClick}
          {...others}
        >
          {children}
        </a>
      );
    } else {
      return (
        <RouterLink
          className={clsx('link', className)}
          to={{
            pathname: href,
            state: state,
          }}
          onClick={handleClick}
          {...others}
        >
          {children}
        </RouterLink>
      );
    }
  },
);

// react-router-dom v6
// import React, { PropsWithChildren, MouseEvent } from 'react';
// import { Link as RouterLink, useNavigate } from 'react-router-dom';

// interface LinkProps {
//   className: string;
//   href: string;
//   state?: any;
// }

// export const Link: React.FC<PropsWithChildren<LinkProps>> = React.memo(
//   ({ className, href, children, state, ...others }) => {
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
