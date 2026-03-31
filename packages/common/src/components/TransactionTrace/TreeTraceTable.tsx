import { useMemo } from 'react';
import { Table, TableProps } from '../Table';
import { concat, uniq } from 'lodash';
import { TraceDetail } from './TraceDetail';
import { TreeTraceForUI } from 'src/utils/hooks/useTxTrace';

export const TreeTraceTable = ({
  data,
  columns,
  loading = false,
  showHeader = true,
  colorReverse,
  treeExpandedKeys,
  detailExpandedKeys,
  space,
}: {
  data?: TreeTraceForUI[];
  columns: TableProps<TreeTraceForUI>['columns'];
  loading?: boolean;
  showHeader?: boolean;
  colorReverse?: boolean;
  treeExpandedKeys: string[];
  detailExpandedKeys: string[];
  space: 'evm' | 'core';
}) => {
  const expandedRowKeys = useMemo(() => {
    return uniq(concat(treeExpandedKeys, detailExpandedKeys));
  }, [treeExpandedKeys, detailExpandedKeys]);

  return (
    <Table
      columns={columns}
      rowKey="index"
      data={data}
      loading={loading}
      showHeader={showHeader}
      rowClassName={(record, index) => {
        if (detailExpandedKeys.includes(record.index)) return '!bg-#f0f5ff';
        return colorReverse
          ? index % 2 !== 0
            ? '!bg-#f9fafb'
            : '!bg-transparent'
          : index % 2 !== 0
            ? '!bg-transparent'
            : '!bg-#f9fafb';
      }}
      expandable={{
        showExpandColumn: false,
        expandedRowKeys,
        expandedRowRender: (
          record: TreeTraceForUI,
          index,
          indent,
          expanded,
        ) => {
          if (!expanded) return null;
          const isDetailedExpanded = detailExpandedKeys.includes(record.index);
          const isTreeExpanded = treeExpandedKeys.includes(record.index);
          return (
            <div>
              {isDetailedExpanded && record.input && (
                <TraceDetail
                  abi={record.abi}
                  input={record.input}
                  output={record.result?.returnData}
                  to={record.to}
                  success={record.result?.outcome === 'success'}
                  isContractCreated={!!record.contractCreated}
                  space={space}
                  proxy={record.proxy}
                />
              )}
              {isTreeExpanded && (
                <TreeTraceTable
                  data={record.calls}
                  columns={columns}
                  showHeader={false}
                  colorReverse={
                    colorReverse ? index % 2 !== 0 : index % 2 === 0
                  }
                  treeExpandedKeys={treeExpandedKeys}
                  detailExpandedKeys={detailExpandedKeys}
                  space={space}
                />
              )}
            </div>
          );
        },
      }}
    />
  );
};
