import { StageUser } from '@/types/stage/stage.type';
import { Text } from '@/components/atomic';
import { ColumnDef } from '@tanstack/react-table';
import { getName } from 'country-list';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const CountryNameComponent = (nationality: string) => {
  return (
    <div className="flex items-center">
      <span className={`fi fi-${nationality.toLowerCase()}`}></span>
      <div className="w-2" />
      <Text intent={'dark'} size={'xs'} weight={'semiBold'}>
        {getName(nationality) ?? nationality}
      </Text>
    </div>
  );
};

export const columns: ColumnDef<StageUser>[] = [
  {
    accessorKey: 'first name',
    header: 'First name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.user?.firstName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'last name',
    header: 'Last name',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.user?.lastName}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'email',
    header: 'Email address',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.user?.email}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'country',
    header: 'Country',
    cell: ({ row }) => {
      return CountryNameComponent(row.original.user?.nationalityCode ?? '');
    },
  },
  {
    accessorKey: 'nic',
    header: 'Identity/NIC',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.user?.passportNumber !== null
              ? row.original.user?.passportNumber
              : row.original.user?.nicNumber}
          </Text>
        </div>
      );
    },
  },
  {
    accessorKey: 'completion',
    header: 'Stage completed',
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Text intent={'dark'} size={'md'} weight={'medium'}>
            {row.original.userTrailTracking !== null
              ? `${row.original.userTrailTracking?.completion}%`
              : '-'}
          </Text>
        </div>
      );
    },
  },
];
