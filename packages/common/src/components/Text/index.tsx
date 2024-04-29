import React from 'react';
import clsx from 'clsx';
import { Tooltip } from '../Tooltip';
import { selectText } from '../../utils';
import { useBreakpoint } from '../../utils/media';

type NormalTypes =
  | 'default'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'primary';

type TextProps = {
  children?: React.ReactNode;
  maxWidth?: string;
  maxCount?: number;
  hoverValue?: React.ReactNode;
  hoverValueMaxCount?: number;
  tag?: 'p' | 'span';
  type?: NormalTypes;
};
type NativeAttrs = Omit<React.HTMLAttributes<any>, keyof TextProps>;

const getTypeColor = (type: NormalTypes) => {
  const colors: { [key in NormalTypes]: string } = {
    default: 'inherit',
    primary: '#7cd77b',
    secondary: '#666',
    success: '#7cd77b',
    warning: '#ffc438',
    error: '#e15c56',
  };

  return colors[type] || colors.default;
};

// note:
// 1. maxWidth priority is higher than maxCount
// 2. maxCount only apply to string
// 3. if hoverValue is provided, use hoverValue as Tooltip text, otherwise use children
//    if text of prop tooltip is provided, use as Tooltip text
export const Text = React.memo(
  ({
    className,
    children,
    maxWidth,
    maxCount,
    hoverValue,
    hoverValueMaxCount: outerHoverValueMaxCount,
    tag = 'p',
    type = 'default',
    ...props
  }: NativeAttrs & TextProps) => {
    const Component = tag;
    const bp = useBreakpoint();
    let child: React.ReactNode = children;
    if (maxWidth === undefined && maxCount && typeof children === 'string') {
      child = String.prototype.substr.call(children, 0, maxCount) + '...';
    }

    let textContent = hoverValue || children;
    // 控制移动端字符串类型 tooltip 的长度
    // 这里有个问题，就是截断的位置可能是一个完整的单词，暂时没有办法处理，如果为了避免这种情况，需要由外面传入前对内容进行处理，比如设置固定宽度小于 24rem
    // @todo 后续可以试下读取文本长度，动态设置容器宽度值的方式，可以避免截断位置的问题
    if (bp === 's' && typeof textContent === 'string') {
      const hoverValueMaxCount = outerHoverValueMaxCount || 34; // default text count is 36
      let textContentCopy: string = textContent;
      let newTextContent: Array<React.ReactNode> = [];
      let count = 0;
      while (textContentCopy.length > hoverValueMaxCount) {
        newTextContent.push(
          <span key={count}>
            {textContentCopy.substr(0, hoverValueMaxCount)}
          </span>,
        );
        newTextContent.push(<br key={`br${count}`} />);
        textContentCopy = textContentCopy.substr(hoverValueMaxCount);
        // 防止文本过长的情况
        if (count > 3) {
          textContentCopy =
            textContentCopy.substr(0, hoverValueMaxCount - 3) + '...';
        }
      }
      newTextContent.push(<span key={++count}>{textContentCopy}</span>);
      textContent = newTextContent;
    }
    const tooltipText = React.createElement(
      'div',
      {
        onClick: e => {
          e.preventDefault();
          e.stopPropagation();
          selectText(e.currentTarget);
        },
      },
      textContent,
    );

    const p = { title: tooltipText };
    return React.createElement(Tooltip, p, [
      <span key="text">
        <Component
          className={clsx(
            'sirius-text truncate vertical-bottom',
            'all-[a]:truncate all-[a]:vertical-bottom all-[a]:cursor-pointer all-[a:hover]:text-#0626ae',
            className,
          )}
          style={{
            maxWidth,
            display: maxWidth === undefined ? 'inherit' : 'inline-block',
            color: getTypeColor(type),
          }}
          {...props}
        >
          {child}
        </Component>
      </span>,
    ]);
  },
);
