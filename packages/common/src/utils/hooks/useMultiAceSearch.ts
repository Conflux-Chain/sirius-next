import { useCallback, useRef, useState } from 'react';
import ReactAce from 'react-ace/lib/ace';
import { Ace, Range } from 'ace-builds';

type RangeType = Ace.Range;

interface EditorSearchStatus {
  // 编辑器的起始搜索序号
  start: number;
  // 编辑器每个搜索结果对应的位置
  rangeList: RangeType[];
}

const zeroRangeInEditor = new Range(0, 0, 0, 0);

// 判断两个 Range 的位置关系
const checkRange = (range1: RangeType, range2: RangeType) => {
  // 因为搜索结果位置不会重叠， 所以只需要判断 start 位置即可
  if (
    range1.start.row === range2.start.row &&
    range1.start.column === range2.start.column
  ) {
    return 'equal';
  }
  if (
    range1.start.row > range2.start.row ||
    (range1.start.row === range2.start.row &&
      range1.start.column > range2.start.column)
  ) {
    return 'after';
  }
  return 'before';
};

const timeout = 50;

export const useMultiAceSearch = ({
  onSearchEmpty,
}: {
  // 需要保证不会随着组件重新渲染而重新初始化，推荐使用 useCallback 或在组件外定义
  onSearchEmpty?: () => void;
} = {}) => {
  // 是否处在搜索状态
  const [inSearch, setInSearch] = useState(false);
  // 搜索内容
  const [searchValue, setSearchValue] = useState('');
  // 管理编辑器实例
  const editorListRef = useRef<ReactAce[]>([]);
  // 管理每个编辑器实例的搜索状态
  const editorSearchStatusListRef = useRef<EditorSearchStatus[]>([]);
  // 记录当前搜索中的编辑器索引
  const editorIndexRef = useRef(0);
  // 记录搜索结果总数，用于页面显示
  const [total, setTotal] = useState<number | null>(null);
  // 记录当前搜索结果索引，用于页面显示
  const [searchIndex, setSearchIndex] = useState<number | null>(null);
  // 记录搜索结果总数，用于内部计算
  const totalRef = useRef<number | null>(null);
  // 延时定位编辑器，避免搜索位置还没更新
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 初始化搜索状态
  const initSearch = useCallback(
    (reset = false) => {
      if (searchValue === '') {
        return [true, 0] as const;
      }
      // 是否是新搜索
      let isNew = false;
      if (totalRef.current === null || reset) {
        // 每个编辑器第一个搜索结果在全局的索引
        let start = 0;
        // 全局搜索结果总数
        let _total = 0;
        editorSearchStatusListRef.current = editorListRef.current.map(
          editor => {
            // 初始化搜索状态
            const searchStatus: EditorSearchStatus = {
              start,
              rangeList: [],
            };
            // 默认从编辑器起始位置开始搜索，使用 find 方法查询每个结果的位置，不能使用 findAll
            let range = editor.editor.find(searchValue, {
              start: zeroRangeInEditor,
              skipCurrent: true,
              backwards: false,
            }) as unknown as RangeType | false;
            let startRange = range as RangeType;
            while (range) {
              // 如果 range 存在，说明有搜索结果， stage + 1 且记录 range 位置
              start++;
              searchStatus.rangeList.push(range);
              // 再次查找下一个搜索结果
              range = editor.editor.find(searchValue, {
                skipCurrent: true,
                backwards: false,
              }) as unknown as RangeType;
              // 如果当前 range 不在 startRange 之后，说明搜索结果重复，退出循环
              if (checkRange(range, startRange) !== 'after') {
                break;
              }
            }
            _total += searchStatus.rangeList.length;
            return searchStatus;
          },
        );
        setTotal(_total);
        totalRef.current = _total;
        isNew = true;
      }
      // 没有搜索结果
      if (totalRef.current === 0) {
        onSearchEmpty?.();
      }
      return [isNew || reset, totalRef.current] as const;
    },
    [searchValue, onSearchEmpty],
  );
  // 从 index 查询下一个可用于搜索的编辑器索引
  const getNextAvailableEditor = useCallback((index: number, direction = 1) => {
    // + editorListRef.current.length 避免负数
    const initIndex =
      (index + editorListRef.current.length) % editorListRef.current.length;
    let currentEditorIndex = initIndex;
    let currentEditorSearchStatus =
      editorSearchStatusListRef.current[currentEditorIndex];
    while (
      !currentEditorSearchStatus ||
      currentEditorSearchStatus.rangeList.length === 0
    ) {
      // 如果当前编辑器没有搜索结果，则尝试下一个编辑器
      currentEditorIndex =
        (currentEditorIndex + editorListRef.current.length + direction) %
        editorListRef.current.length;
      currentEditorSearchStatus =
        editorSearchStatusListRef.current[currentEditorIndex];
    }
    return [currentEditorIndex, currentEditorIndex !== initIndex] as const;
  }, []);
  const scrollToEditor = useCallback((editor: ReactAce) => {
    // 清除当前延时定位
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    // 延迟定位到搜索结果的位置，因为编辑器更新 textarea 需要时间，所以不能直接定位
    scrollTimeoutRef.current = setTimeout(() => {
      // 优先定位编辑器内的 textarea 标签，对应组件的光标所在位置，否则定位编辑器本身，此时可能会因为编辑器内容过多导致定位不准确
      const textarea = editor.refEditor.getElementsByTagName('textarea')[0];
      (textarea ?? editor.refEditor).scrollIntoView({ block: 'center' });
      scrollTimeoutRef.current = null;
    }, timeout);
  }, []);
  const findPrevious = useCallback(() => {
    const [isNewSearch, total] = initSearch();
    // 没有搜索结果
    if (total === 0) return;
    setInSearch(true);
    const editorList = editorListRef.current;
    // 新的搜索从最后一个编辑器开始，否则从上一次搜索的编辑器开始
    const [currentEditorIndex, isEditorChanged] = getNextAvailableEditor(
      isNewSearch ? editorList.length - 1 : editorIndexRef.current,
      -1,
    );
    // 获取当前编辑器实例和搜索状态
    let currentEditor = editorList[currentEditorIndex]!;
    let currentEditorSearchStatus =
      editorSearchStatusListRef.current[currentEditorIndex]!;
    // 获取第一和最后一个搜索结果的位置
    const prevRange = currentEditor.editor.selection.getRange();
    const startRange = currentEditorSearchStatus.rangeList[0]!;
    let range = currentEditor.editor.find(searchValue, {
      // 如果是新的搜索或者切换了编辑器，那么从第一个结果开始搜索，同时忽略当前结果，找到的就是最后一个结果
      start: isNewSearch || isEditorChanged ? startRange : undefined,
      // 如果是在当前编辑器内继续搜索，那么直接忽略当前结果查找上一个结果
      skipCurrent: true,
      // 从后往前查找
      backwards: true,
    }) as unknown as RangeType;
    // 更新搜索编辑器的索引
    editorIndexRef.current = currentEditorIndex;
    if (
      checkRange(range, prevRange) !== 'before' &&
      !isEditorChanged &&
      !isNewSearch
    ) {
      // 不是新的搜索，且没有切换编辑器，且找到的结果不在之前的位置签名，说明已经搜索完成回到末尾，那么需要切换到上一个编辑器
      const [nextEditorIndex] = getNextAvailableEditor(
        currentEditorIndex - 1,
        // 指定查找编辑器的方向
        -1,
      );
      // 重新更新搜索编辑器的索引
      editorIndexRef.current = nextEditorIndex;
      // 获取当前编辑器实例和搜索状态
      currentEditor = editorList[nextEditorIndex]!;
      currentEditorSearchStatus =
        editorSearchStatusListRef.current[nextEditorIndex]!;
      // 获取第一个搜索结果的位置
      const startRange = currentEditorSearchStatus.rangeList[0]!;
      range = currentEditor.editor.find(searchValue, {
        // 当前已知是切换了编辑器，所以从第一个结果开始搜索，同时忽略当前结果，找到的就是最后一个结果
        start: startRange,
        skipCurrent: true,
        backwards: true,
      }) as unknown as RangeType;
    }
    // 滚动到编辑器
    scrollToEditor(currentEditor);
    // 计算更新结果在所有结果中的序号
    const searchIndex =
      currentEditorSearchStatus.rangeList.findIndex(
        pr => checkRange(range, pr) === 'equal',
      ) +
      currentEditorSearchStatus.start +
      1;
    setSearchIndex(searchIndex);
  }, [searchValue, initSearch, getNextAvailableEditor, scrollToEditor]);
  const findNext = useCallback(() => {
    const [isNewSearch, total] = initSearch();
    // 没有搜索结果
    if (total === 0) return;
    setInSearch(true);
    const editorList = editorListRef.current;
    // 新的搜索从第一个编辑器开始，否则从上一次搜索的编辑器开始
    const [currentEditorIndex, isEditorChanged] = getNextAvailableEditor(
      isNewSearch ? 0 : editorIndexRef.current,
    );
    // 获取当前编辑器实例和搜索状态
    let currentEditor = editorList[currentEditorIndex]!;
    const prevRange = currentEditor.editor.selection.getRange();
    let currentEditorSearchStatus =
      editorSearchStatusListRef.current[currentEditorIndex]!;
    // 获取最后一个搜索结果的位置
    const endRange =
      currentEditorSearchStatus.rangeList[
        currentEditorSearchStatus.rangeList.length - 1
      ]!;
    let range = currentEditor.editor.find(searchValue, {
      // 如果是新的搜索或者切换了编辑器，那么从最后一个结果开始搜索，同时忽略当前结果，找到的就是第一个结果
      start: isNewSearch || isEditorChanged ? endRange : undefined,
      // 如果是在当前编辑器内继续搜索，那么直接忽略当前结果查找下一个结果
      skipCurrent: true,
      // 从前往后查找
      backwards: false,
    }) as unknown as RangeType;
    // 更新搜索编辑器的索引
    editorIndexRef.current = currentEditorIndex;
    if (checkRange(range, prevRange) !== 'after' && !isNewSearch) {
      // 不是新的搜索，且没有切换编辑器，且找到的位置不在之前的位置后面，说明已经搜索完成回到开头，那么需要切换到下一个编辑器
      const [nextEditorIndex] = getNextAvailableEditor(currentEditorIndex + 1);
      // 重新更新搜索编辑器的索引
      editorIndexRef.current = nextEditorIndex;
      // 获取当前编辑器实例和搜索状态
      currentEditor = editorList[nextEditorIndex]!;
      currentEditorSearchStatus =
        editorSearchStatusListRef.current[nextEditorIndex]!;
      // 获取最后一个搜索结果的位置
      const endRange =
        currentEditorSearchStatus.rangeList[
          currentEditorSearchStatus.rangeList.length - 1
        ]!;
      range = currentEditor.editor.find(searchValue, {
        // 当前已知是切换了编辑器，所以从最后一个结果开始搜索，同时忽略当前结果，找到的就是第一个结果
        start: endRange,
        skipCurrent: true,
        backwards: false,
      }) as unknown as RangeType;
    }
    // 滚动到编辑器
    scrollToEditor(currentEditor);
    // 计算更新结果在所有结果中的序号
    const searchIndex =
      currentEditorSearchStatus.rangeList.findIndex(
        pr => checkRange(range, pr) === 'equal',
      ) +
      currentEditorSearchStatus.start +
      1;
    setSearchIndex(searchIndex);
  }, [searchValue, initSearch, getNextAvailableEditor, scrollToEditor]);
  const reset = useCallback((resetSearchValue = false) => {
    if (resetSearchValue === true) {
      setSearchValue('');
    }
    editorSearchStatusListRef.current = [];
    editorIndexRef.current = 0;
    totalRef.current = null;
    setTotal(null);
    setSearchIndex(null);
  }, []);
  return {
    editorListRef,
    searchValue,
    total,
    searchIndex,
    inSearch,
    setSearchValue: useCallback(
      (value: string) => {
        setSearchValue(value);
        // reset
        reset();
      },
      [reset],
    ),
    setEditorIndex: useCallback((index: number) => {
      editorIndexRef.current = index;
    }, []),
    findNext,
    findPrevious,
    reset,
    exitSearch: useCallback(() => {
      setInSearch(false);
      reset();
    }, [reset]),
  };
};
