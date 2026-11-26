import { useMemo } from 'react';
import qs from 'query-string';
import { Table } from '../Table';
import { useLocation } from 'react-router-dom';
import { useEventLogScan } from '../../utils/hooks/useEventLogScan';
import { useContractDetail } from '../../utils/hooks/useContractDetail';
import { Empty } from '../Empty';
import { CursorPagination } from '../CursorPagination';
import { EventLogPage, EventLogRequest } from '../../utils/eventLogScan';
import clsx from 'clsx';
import { Space } from '../../utils/types';

interface Props<Log> {
  space: Space;
  title: (valid: boolean) => React.ReactNode;
  address: string;
  contractInfo?: any;
  columns: (
    contractInfo: any,
    implementContractInfo: any,
  ) => {
    width: number;
    title: React.JSX.Element;
    dataIndex: string | string[];
    key: string;
    render: (value: any, row: any) => React.JSX.Element | null;
  }[];
  request: (
    method: string,
    request: EventLogRequest,
  ) => Promise<EventLogPage<Log>>;
}

export function ContractEventList<Log>({
  space,
  address,
  contractInfo,
  request,
  title,
  columns,
}: Props<Log>) {
  const { search } = useLocation();
  const query = useMemo(() => qs.parse(search), [search]);
  const {
    data,
    isLoading: isLogsLoading,
    valid,
    scanKey,
    pageSize,
    setCursor,
  } = useEventLogScan<Log>(space, address, query, request);
  const { data: implementContractInfo, isLoading: isImplementationLoading } =
    useContractDetail(contractInfo?.implementation?.address);

  const isLoading = isLogsLoading || isImplementationLoading;
  const dataSource = data?.logs ?? [];

  return (
    <>
      <Table
        className={clsx(
          '[&>.ant-table-title]:p-[1.1429rem]',
          '[&_.ant-table-tbody>tr:not([aria-hidden=true]):nth-child(odd)]:[background-color:unset]',
          '[&_td]:align-top',
          'ant-table-bordered',
          '[&.ant-table-bordered>.ant-table-container>.ant-table-content>table>thead>tr>th]:[border-right:none]',
          '[&.ant-table-bordered>.ant-table-container>.ant-table-content>table>tbody>tr>td]:[border-right:none]',
        )}
        data={isLoading ? [] : dataSource}
        columns={columns(contractInfo, implementContractInfo)}
        rowKey={(record: any) => `${record.transactionHash}-${record.logIndex}`}
        loading={isLogsLoading || isImplementationLoading}
        title={() => title(valid)}
        emptyText={<Empty show={true} />}
        // TODO
        // bordered
      />
      <div className="mt-24px w-full flex justify-end">
        <CursorPagination
          key={scanKey}
          nextCursor={data?.nextCursor}
          loading={isLogsLoading}
          pageSize={pageSize}
          count={dataSource.length}
          onPrevious={setCursor}
          onNext={setCursor}
        />
      </div>
    </>
  );
}
