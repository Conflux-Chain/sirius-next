/*
 * Media queries utility
 */
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

/*
 * Taken from https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32914
 */
// Update your breakpoints if you want
export const sizes = {
  s: 768,
  m: 1024,
  l: 1280,
  xl: 1440,
  xxl: 1920,
};

type SubscribeFunc = (size: string) => void;
const subscribers = new Map<Number, SubscribeFunc>();
let subUid = -1;
let size = '';
const ResponsiveObserve = {
  sortedBreakpoints: Object.entries(sizes).sort((a, b) =>
    a[1] <= b[1] ? 1 : -1,
  ),
  dispatch(innerWidth: number) {
    const length = this.sortedBreakpoints.length;
    let _size = this.sortedBreakpoints[0]![0];
    for (let i = 0; i < length; i++) {
      const [name, width] = this.sortedBreakpoints[i]!;
      if (innerWidth <= width) {
        _size = name;
      }
    }
    size = _size;
    subscribers.forEach(func => func(_size));
    return _size;
  },
  subscribe(func: SubscribeFunc): number {
    if (!subscribers.size) this.register();
    subUid += 1;
    subscribers.set(subUid, func);
    func(size);
    return subUid;
  },
  unsubscribe(token: number) {
    subscribers.delete(token);
    if (!subscribers.size) this.unregister();
  },
  unregister() {
    window.removeEventListener('resize', this.listener);
  },
  register() {
    window.addEventListener('resize', this.listener);
    this.listener();
  },
  listener: debounce(() => {
    ResponsiveObserve.dispatch(window.innerWidth);
  }, 1000),
};

ResponsiveObserve.dispatch(window.innerWidth);

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(size);

  useEffect(() => {
    const token = ResponsiveObserve.subscribe(supportScreens => {
      setBreakpoint(supportScreens);
    });

    return () => ResponsiveObserve.unsubscribe(token);
  }, []);

  return breakpoint;
};

/* Example
  const Demo = () => {
  const breakpoint = useBreakpoint();

  if (breakpoint === "xl") return <div>xl</div>;
  else if (breakpoint == "l") return <div>l</div>;
  else if (breakpoint == "m") return <div>m</div>;
  else return <div>s</div>;
  };
*/

const customMediaQuery = (size: keyof typeof sizes) =>
  `@media (max-width:${sizes[size]}px)`;

export const media = {
  s: customMediaQuery('s'),
  m: customMediaQuery('m'),
  l: customMediaQuery('l'),
  xl: customMediaQuery('xl'),
  xxl: customMediaQuery('xxl'),
};

/* Example
const SomeDiv = styled.div`
  display: flex;
  ....
  ${media.m} {
    display: block
  }
`;
*/
