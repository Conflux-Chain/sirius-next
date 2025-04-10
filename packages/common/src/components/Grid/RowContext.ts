import { createContext } from 'react';
import type { Context } from 'react';

export interface RowContextState {
  gutter?: [number, number];
  wrap?: boolean;
}

const RowContext: Context<RowContextState> = createContext({});

export default RowContext;
