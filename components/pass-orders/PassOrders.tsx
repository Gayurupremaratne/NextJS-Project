import { OrderByStageResponse } from '@/types/order/order.type';
import { DataTable, Spinner } from '../atomic';
import { columns } from './columns';
import { useEffect, useState } from 'react';
import { useGetOrdersByStage } from '@/hooks/order/order';
import { USER_LIST_PAGE_SIZE } from '@/constants/pagination-page-size';
import dayjs from 'dayjs';

interface Props {
  stageId: string;
  date: Date;
}

const PassOrders = ({ stageId, date }: Props) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [orders, setOrders] = useState<OrderByStageResponse[]>([]);
  const [sortBy, setSortBy] = useState<string>('');

  const handlePageChange = (newPage: number) => setCurrentPage(newPage);

  const { data, isLoading, refetch } = useGetOrdersByStage(
    stageId,
    dayjs(date).format('YYYY-MM-DD'),
    USER_LIST_PAGE_SIZE,
    currentPage + 1,
    sortBy,
  );

  useEffect(() => {
    if (data) {
      setOrders(data.data.data);
      setTotalPages(data.data.meta?.lastPage);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [currentPage, sortBy]);

  if (isLoading) {
    return (
      <Spinner
        className="flex items-center justify-center mx-auto"
        loading={true}
        spinnerSize="md"
      />
    );
  }
  return (
    <DataTable<OrderByStageResponse>
      columns={columns}
      currentPage={currentPage}
      data={orders}
      onPageChange={handlePageChange}
      setSortBy={setSortBy}
      totalPages={totalPages}
    />
  );
};

export default PassOrders;
