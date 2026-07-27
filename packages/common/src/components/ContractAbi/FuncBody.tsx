/**
 *
 * FuncBody Component
 *
 */
import React from 'react';

interface FuncBodyProps {
  children: React.ReactNode;
}

export const FuncBody = ({ children }: FuncBodyProps) => {
  return <div className="pl-7px">{children}</div>;
};
