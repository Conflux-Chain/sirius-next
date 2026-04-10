import _Table, { TableProps } from '@rc-component/table';
import { Spin } from '../Spin';
import { Empty } from '../Empty';

export const Table = ({
  className,
  loading = false,
  ...rest
}: TableProps & {
  loading?: boolean;
}) => {
  return (
    <Spin spinning={loading}>
      <_Table
        // temp set prefixCls = 'ant-table' to use antd table style
        prefixCls="ant-table"
        className={className}
        {...rest}
        emptyText={<Empty show={true} />}
      />
    </Spin>
  );
};

export type { TableProps };
