import AceEditorComponent, { ICommand } from 'react-ace';
import React, {
  ComponentProps,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { mergeRefs } from 'react-merge-refs';
import clsx from 'clsx';
import { Minimize, Maximize } from 'lucide-react';
import { useMeasure } from 'react-use';
import { useI18n } from 'src/store';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '../Tooltip';

export const AceEditor = forwardRef<
  AceEditorComponent | null,
  ComponentProps<typeof AceEditorComponent> & {
    onSearchTrigged?: () => void;
    onReplaceTrigged?: () => void;
    resize?: boolean;
    title?: React.ReactNode;
    supportFullScreen?: boolean;
    headerClassName?: string;
  }
>(
  (
    {
      onSearchTrigged,
      onReplaceTrigged,
      theme = 'tomorrow',
      width = '100%',
      fontSize = '1rem',
      resize = true,
      height: _height,
      commands: _commands,
      title,
      headerClassName,
      supportFullScreen = false,
      maxLines: _maxLines,
      className,
      ...props
    },
    ref,
  ) => {
    const { translations } = useI18n();
    const { t } = useTranslation();
    const showHeader = supportFullScreen || !!title;
    const fullScreenLockRef = useRef(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [height, setHeight] = useState(_height);
    const innerEditorRef = useRef<AceEditorComponent>(null);
    const [measureRef, bounds] = useMeasure();

    // 当窗口大小改变时，自动退出全屏模式
    useEffect(() => {
      if (!resize || !bounds.height) return;
      // 通过 fullScreenLockRef 避免打开全屏模式时自动退出全屏
      if (!fullScreenLockRef.current) {
        setIsFullScreen(false);
        setHeight(`${bounds.height}px`);
      } else {
        fullScreenLockRef.current = false;
      }
    }, [bounds.height, resize]);

    const commands = useMemo(() => {
      return [
        {
          bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
          name: 'Search',
          exec: e => {
            // 触发外部的搜索弹窗事件
            onSearchTrigged?.();
            // 触发当前编辑器的搜索事件
            e.execCommand('find');
          },
          // 在 readonly 模式下也可用
          readOnly: true,
        },
        {
          bindKey: { win: 'Ctrl-H', mac: 'Command-Option-F' },
          name: 'Search+Replace',
          exec: e => {
            // 触发外部的替换弹窗事件
            onReplaceTrigged?.();
            // 触发当前编辑器的替换事件
            e.execCommand('replace');
          },
          // 在 readonly 模式下也可用
          readOnly: true,
        },
        ...(_commands || []),
      ] as ICommand[];
    }, [_commands, onSearchTrigged, onReplaceTrigged]);

    const maxLines = isFullScreen ? Infinity : _maxLines;

    return (
      <div>
        {showHeader && (
          <div className={clsx('flex items-center mb-10px', headerClassName)}>
            <div className="flex-1">{title}</div>
            <div className="shrink-0 flex items-center gap-5px">
              {supportFullScreen && (
                <Tooltip
                  title={t(translations.toolTip.contract.toggleFullscreen)}
                >
                  <div
                    className="bg-#F8F9FB hover:bg-#E9ECEF flex-center w-30px h-30px rounded-4px cursor-pointer"
                    onClick={() => {
                      if (!isFullScreen) {
                        fullScreenLockRef.current = true;
                        setHeight(undefined);
                        setIsFullScreen(true);
                      } else {
                        setHeight(_height);
                        setIsFullScreen(false);
                      }
                    }}
                  >
                    {isFullScreen ? (
                      <Minimize className="w-15px h-15px" />
                    ) : (
                      <Maximize className="w-15px h-15px" />
                    )}
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        )}
        <AceEditorComponent
          ref={mergeRefs([
            resize
              ? editor => {
                  if (editor) {
                    measureRef(editor.editor.container);
                  }
                }
              : undefined,
            innerEditorRef,
            ref,
          ])}
          theme={theme}
          className={clsx(
            'bg-#F8F9FB',
            isFullScreen && 'min-h-5rem',
            resize && 'resize-y',
            className,
          )}
          width={width}
          height={height}
          fontSize={fontSize}
          commands={commands}
          maxLines={maxLines}
          {...props}
        />
      </div>
    );
  },
);
