import { IReportUserDetails } from '@/types/reported-images/reported-images';
import { ColumnDef } from '@tanstack/react-table';
import { Text } from '@/components/atomic';

export const reportUserColumns = (): ColumnDef<IReportUserDetails>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    cell: ({ row }) => {
      const fullName = `${row?.original?.user.firstName} ${row?.original?.user.lastName}`;
      return (
        <div className="flex items-center">
          <Text size={'md'} weight={'medium'}>
            {fullName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'reportedDate',
    header: 'Date reported',
    enableSorting: true,
    cell: ({ row }) => {
      const reportedDate = new Date(row?.original?.reportedDate);

      // Extract day, month, and year components
      const day = reportedDate.getUTCDate().toString().padStart(2, '0');
      const month = (reportedDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, '0'); // Months are 0-based, so add 1
      const year = reportedDate.getUTCFullYear();

      return (
        <div className="flex items-center">
          <Text className="" size={'sm'} weight={'medium'}>
            {`${day}-${month}-${year}`}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'comment',
    header: 'User comments',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text intent={'grey'} size={'sm'} weight={'normal'}>
            {row?.original?.comment}
          </Text>
        </div>
      );
    },
  },
];
