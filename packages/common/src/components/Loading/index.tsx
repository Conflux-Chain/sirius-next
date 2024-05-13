import React, { useEffect, useRef } from 'react';
import loading from './loading';

export const Loading: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let cb = () => {};
    if (ref.current) {
      cb = loading(ref.current);
    }
    return cb;
  }, []);
  return <div ref={ref}></div>;
};
