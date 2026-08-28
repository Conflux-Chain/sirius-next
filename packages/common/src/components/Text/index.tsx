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
  mobileMaxWidth?: string;
  maxCount?: number;
  mobileMaxCount?: number;
  hoverValue?: React.ReactNode;
  hoverValueMaxCount?: number;
  tag?: 'p' | 'span';
  type?: NormalTypes;
  hideTooltip?: boolean;
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

// Behavior contract:
// 1. maxWidth has priority over maxCount.
// 2. maxCount applies only to string children.
// 3. hoverValue is preferred as Tooltip text; otherwise children are used.
// 4. On mobile, long tooltip text is split into fixed-size segments for the current
//    address/table layouts. Changes require narrow-screen and multilingual visual checks.
export const Text = React.memo(
  ({
    className,
    children,
    maxWidth: _maxWidth,
    mobileMaxWidth = _maxWidth,
    maxCount: _maxCount,
    mobileMaxCount = _maxCount,
    hoverValue,
    hoverValueMaxCount: outerHoverValueMaxCount,
    tag = 'p',
    type = 'default',
    hideTooltip = false,
    ...props
  }: NativeAttrs & TextProps) => {
    const Component = tag;
    const bp = useBreakpoint();
    let child: React.ReactNode = children;
    const maxCount = bp === 's' ? mobileMaxCount : _maxCount;
    const maxWidth = bp === 's' ? mobileMaxWidth : _maxWidth;
    if (
      maxWidth === undefined &&
      maxCount &&
      typeof children === 'string' &&
      children.length > maxCount
    ) {
      child = String.prototype.substr.call(children, 0, maxCount) + '...';
    }

    let textContent = hoverValue || children;
    // 当前移动端 tooltip 默认按 34 个字符分段，兼容地址和表格中的长文本。
    // 分段可能落在完整单词中；改为动态宽度前，需要结合英文、中文、地址和窄屏
    // 页面完成视觉回归，不能只根据单个调用方判断。
    // @todo [待确认] 评估按实际文本宽度动态设置容器宽度的方案。
    if (bp === 's' && typeof textContent === 'string') {
      const hoverValueMaxCount = outerHoverValueMaxCount || 34; // default text count is 34
      let textContentCopy: string = textContent;
      const newTextContent: Array<React.ReactNode> = [];
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
    const tooltipText =
      !hideTooltip &&
      React.createElement(
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
