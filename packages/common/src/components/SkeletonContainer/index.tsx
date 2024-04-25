import React from 'react';
import { Skeleton } from '../Skeleton';

interface SkeletonContainerProps {
  children?: React.ReactNode;
  shown?: boolean;
  style?: React.CSSProperties;
}
type NativeAttrs = Omit<
  React.HTMLAttributes<any>,
  keyof SkeletonContainerProps
>;
export declare type Props = SkeletonContainerProps & NativeAttrs;
const SkeletonStyle = { display: 'flex', flex: 1, maxWidth: 'initial' };
export const SkeletonContainer = ({
  children,
  shown = false,
  style,
}: Props) => {
  return (
    <>
      {shown ? (
        <Skeleton style={{ ...SkeletonStyle, ...style }}>{children}</Skeleton>
      ) : (
        children
      )}
    </>
  );
};
